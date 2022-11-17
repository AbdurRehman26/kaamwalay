<?php

namespace App\Services\Admin\V2;

use App\Enums\UserCard\UserCardShippingStatus;
use App\Events\API\Admin\Order\ExtraChargeSuccessful;
use App\Events\API\Admin\Order\RefundSuccessful;
use App\Events\API\Admin\Order\UnpaidOrderExtraCharge;
use App\Events\API\Admin\Order\UnpaidOrderRefund;
use App\Exceptions\API\Admin\IncorrectOrderStatus;
use App\Exceptions\API\Admin\Order\FailedExtraCharge;
use App\Exceptions\API\Admin\Order\OrderItem\OrderItemDoesNotBelongToOrder;
use App\Exceptions\API\Admin\Order\OrderItem\OrderItemIsNotGraded;
use App\Http\Resources\API\V2\Customer\Order\OrderPaymentResource;
use App\Jobs\Admin\CreateSocialPreviewsForUserCard;
use App\Models\Order;
use App\Models\OrderAddress;
use App\Models\OrderItem;
use App\Models\OrderItemStatus;
use App\Models\OrderShipment;
use App\Models\OrderStatus;
use App\Models\PaymentMethod;
use App\Models\ShippingMethod;
use App\Models\User;
use App\Models\UserCard;
use App\Services\Admin\Order\OrderItemService;
use App\Services\Admin\Order\ShipmentService;
use App\Services\Admin\V1\OrderService as V1OrderService;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Throwable;

class OrderService extends V1OrderService
{
    /**
     * @throws FailedExtraCharge|Throwable
     */
    public function addExtraCharge(Order $order, User $user, array $data, array $paymentResponse): void
    {
        DB::transaction(function () use ($order, $user, $data, $paymentResponse) {
            $order->updateAfterExtraCharge($data['amount']);

            $order->createOrderPayment($paymentResponse, $user);
        });

        if (! $order->isPaid()) {
            UnpaidOrderExtraCharge::dispatch($order);

            return;
        }

        ExtraChargeSuccessful::dispatch($order);
    }

    public function processRefund(
        Order $order,
        User $user,
        array $data,
        array $refundResponse,
        bool $refundedInWallet = false
    ): void {
        DB::transaction(function () use ($order, $user, $data, $refundResponse, $refundedInWallet) {
            $order->updateAfterRefund($data['amount']);

            $paymentMethodId = $refundedInWallet && $order->isPaid()
                ? PaymentMethod::getWalletPaymentMethod()->id
                : null;

            $order->createOrderPayment($refundResponse, $user, $paymentMethodId);
        });

        if (! $order->isPaid()) {
            UnpaidOrderRefund::dispatch($order);

            return;
        }

        RefundSuccessful::dispatch($order, $data);
    }

    public function getDataForAdminSubmissionConfirmationEmail(Order $order): array
    {
        $data = [];

        $paymentPlan = $order->paymentPlan;
        $orderItems = $order->getGroupedOrderItems();
        $orderPayment = OrderPaymentResource::make($order->firstOrderPayment)->resolve();

        $data["SUBMISSION_NUMBER"] = $order->order_number;
        $data['CUSTOMER_NAME'] = $order->user->getFullName();
        $data['CUSTOMER_EMAIL'] = $order->user->email;
        $data['CUSTOMER_NUMBER'] = $order->user->customer_number;
        $data["TIME"] = $order->created_at->format('h:m A');

        $items = [];
        foreach ($orderItems as $orderItem) {
            $card = $orderItem->cardProduct;
            $items[] = [
                "CARD_IMAGE_URL" => $card->image_path,
                "CARD_NAME" => $card->name,
                "CARD_FULL_NAME" => $this->getCardFullName($card),
                "CARD_VALUE" => number_format($orderItem->declared_value_per_unit, 2),
                "CARD_QUANTITY" => $orderItem->quantity,
                "CARD_COST" => number_format($orderItem->quantity * $paymentPlan->price, 2),
            ];
        }

        $data["ORDER_ITEMS"] = $items;
        $data["SUBTOTAL"] = number_format($order->service_fee, 2);
        $data["SHIPPING_FEE"] = number_format($order->shipping_fee, 2);
        $data["TOTAL"] = number_format($order->grand_total, 2);

        $data["SERVICE_LEVEL"] = $paymentPlan->price;
        $data["NUMBER_OF_CARDS"] = $orderItems->sum('quantity');
        $data["DATE"] = $order->created_at->format('m/d/Y');
        $data["TOTAL_DECLARED_VALUE"] = number_format($order->orderItems->sum('declared_value_per_unit'), 2);

        $data["SHIPPING_ADDRESS"] = $order->shippingAddress ? $this->getAddressData($order->shippingAddress) : [];
        $data["BILLING_ADDRESS"] = $order->billingAddress ? $this->getAddressData($order->billingAddress) : [];

        $data["PAYMENT_METHOD"] = $this->getOrderPaymentText($orderPayment);

        return $data;
    }

    public function shipOrder(Order $order, array $data): OrderShipment|bool
    {
        /** @var ShipmentService $shipmentService */
        $shipmentService = resolve(ShipmentService::class);

        return match ($order->shippingMethod->code) {
            ShippingMethod::INSURED_SHIPPING => $shipmentService->updateShipment($order, $data['shipping_provider'], $data['tracking_number']),
            default => $this->storeOrderItemsInVault($order),
        };
    }

    protected function storeOrderItemsInVault(Order $order): bool
    {
        $orderItemIds = $order
            ->orderItems()
            ->whereHas('userCard')
            ->pluck('id');

        UserCard::whereIn('order_item_id', $orderItemIds)->update([
            'shipping_status' => UserCardShippingStatus::IN_VAULT,
        ]);

        /** @var OrderStatusHistoryService $orderStatusHistoryService */
        $orderStatusHistoryService = resolve(OrderStatusHistoryService::class);

        if (! $order->isShipped()) {
            $orderStatusHistoryService->addStatusToOrder(
                OrderStatus::SHIPPED,
                $order,
                auth()->user(),
            );
        }

        return true;
    }

    /**
     * @throws OrderItemDoesNotBelongToOrder | OrderItemIsNotGraded
     */
    public function cancelOrder(Order $order, User $user): void
    {
        /** @var OrderItemService $orderItemService */
        $orderItemService = resolve(OrderItemService::class);
        $orderItemService->markItemsAsCancelled($order, auth()->user());

        /** @var OrderStatusHistoryService $orderStatusHistoryService */
        $orderStatusHistoryService = resolve(OrderStatusHistoryService::class);
        $orderStatusHistoryService->addStatusToOrder(OrderStatus::CANCELLED, $order, $user, 'Order cancelled by admin');
    }

    public function createManualPayment(Order $order, User $user): Order
    {
        $manualPaymentMethodId = PaymentMethod::whereCode('manual')->value('id');

        $order->payment_method_id = $manualPaymentMethodId;
        $order->save();

        $order->orderPayments()->create([
            'payment_method_id' => $manualPaymentMethodId,
            'user_id' => $user->id,
        ]);

        return $order;
    }

    public function generateSocialPreviewsForCards(Order $order): void
    {
        $order->orderItems()->where('order_item_status_id', OrderItemStatus::GRADED)->each(function (OrderItem $orderItem) {
            CreateSocialPreviewsForUserCard::dispatch($orderItem->userCard);
        });
    }

    public function updateBillingAddress(Order $order, array $data): Order
    {
        if ($order->hasSameShippingAndBillingAddresses() || ! $order->hasBillingAddress()) {
            $orderAddress = OrderAddress::create($data);
            $order->billingAddress()->associate($orderAddress);
            $order->save();

            return $order;
        }

        $order->billingAddress->update($data);

        return $order;
    }

    /**
     * @param  Order  $order
     * @return Collection<int, UserCard>
     */
    public function getCardsByStatus(Order $order, int $status): Collection
    {
        return UserCard::join('order_items', 'order_items.id', 'user_cards.order_item_id')
            ->where('order_id', $order->id)
            ->where('order_items.order_item_status_id', $status)
            ->select('user_cards.*')->get();
    }

    /**
     * @return Collection <int, UserCard>
     * @throws IncorrectOrderStatus
     */
    public function getGrades(Order $order): Collection
    {
        $itemsCount = $order->orderItems()->count();

        $agsPageCount = (int) (ceil($itemsCount / 10) * 10) / 10;

        $itemsPerPage = 10;

        $cards = $this->getCardsForGrading($order);

        for ($iterator = 0; $iterator < $agsPageCount; $iterator++) {
            $grades = $this->agsService->getGrades($this->getOrderCertificates($order), $iterator * $itemsPerPage);
            $this->updateLocalGrades($grades['results'] ?? [], $cards);
        }

        return $cards;
    }

    /**
     * @throws IncorrectOrderStatus
     * @return Collection<int, UserCard>
     */
    public function getCardsForGrading(Order $order): Collection
    {
        if (! $order->canBeGraded()) {
            throw new IncorrectOrderStatus;
        }

        return UserCard::join('order_items', 'user_cards.order_item_id', '=', 'order_items.id')
            ->where('order_items.order_id', $order->id)->select('user_cards.*')->get();
    }
}
