<?php

namespace App\Services\Admin\V2;

use App\Enums\UserCard\UserCardShippingStatus;
use App\Events\API\Admin\Order\ExtraChargeSuccessful;
use App\Events\API\Admin\Order\RefundSuccessful;
use App\Events\API\Admin\Order\UnpaidOrderExtraCharge;
use App\Events\API\Admin\Order\UnpaidOrderRefund;
use App\Exceptions\API\Admin\Order\FailedExtraCharge;
use App\Http\Resources\API\V2\Customer\Order\OrderPaymentResource;
use App\Models\Order;
use App\Models\OrderShipment;
use App\Models\OrderStatus;
use App\Models\PaymentMethod;
use App\Models\ShippingMethod;
use App\Models\User;
use App\Models\UserCard;
use App\Services\Admin\Order\ShipmentService;
use App\Services\Admin\V1\OrderService as V1OrderService;
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

        $orderStatusHistoryService->addStatusToOrder(
            OrderStatus::SHIPPED,
            $order,
            auth()->user(),
        );

        return true;
    }
}
