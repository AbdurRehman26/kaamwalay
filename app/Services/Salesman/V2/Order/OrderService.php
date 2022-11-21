<?php

namespace App\Services\Salesman\V2\Order;

use App\Events\API\Admin\Order\ExtraChargeSuccessful;
use App\Events\API\Admin\Order\RefundSuccessful;
use App\Events\API\Admin\OrderItem\OrderItemCardChangedEvent;
use App\Exceptions\API\Admin\Order\FailedExtraCharge;
use App\Exceptions\API\Admin\Order\OrderItem\OrderItemDoesNotBelongToOrder;
use App\Models\CardProduct;
use App\Models\Order;
use App\Models\OrderAddress;
use App\Models\OrderItem;
use App\Models\OrderItemStatus;
use App\Models\PaymentMethod;
use App\Models\User;
use App\Models\UserCard;
use App\Services\Admin\Order\OrderItemService;
use App\Services\AGS\AgsService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Spatie\QueryBuilder\QueryBuilder;
use Throwable;

class OrderService
{
    public function __construct(
        protected OrderItemService $orderItemService,
        protected AgsService $agsService
    ) {
    }

    public function getOrders(): LengthAwarePaginator
    {
        $itemsPerPage = request('per_page');

        return QueryBuilder::for(Order::query()->salesmanId(auth()->user()->id))
            ->excludeCancelled()
            ->allowedFilters(Order::getAllowedAdminFilters())
            ->allowedIncludes(Order::getAllowedAdminIncludes())
            ->allowedSorts(Order::getAllowedAdminSorts())
            ->defaultSort('-orders.created_at')
            ->paginate($itemsPerPage);
    }

    public function getOrder(int $orderId): Model | QueryBuilder
    {
        return QueryBuilder::for(Order::class)
            ->allowedIncludes(Order::getAllowedAdminIncludes())
            ->findOrFail($orderId);
    }

    public function getOrderCertificates(Order|int $order): array
    {
        $certificates = UserCard::select('certificate_number')
        ->join('order_items', 'user_cards.order_item_id', '=', 'order_items.id')
        ->where('order_items.order_id', getModelId($order))->get();

        return $certificates->pluck('certificate_number')->flatten()->all();
    }

    public function addExtraCard(Order $order, User $user, int $card_id, float $value): OrderItem
    {
        $newItem = OrderItem::create([
            'order_id' => $order->id,
            'card_product_id' => $card_id,
            'quantity' => 1,
            'declared_value_per_unit' => $value,
            'declared_value_total' => $value,
        ]);

        return $this->orderItemService->changeStatus($order, $newItem, ["status" => "confirmed"], $user);
    }

    public function editCard(Order $order, OrderItem $orderItem, int $card_id, float $value): OrderItem
    {
        if ($orderItem->order_id !== $order->id) {
            throw new OrderItemDoesNotBelongToOrder;
        }

        $previousCardProduct = $orderItem->cardProduct;

        $orderItem->card_product_id = $card_id;
        $orderItem->declared_value_per_unit = $value;
        $orderItem->declared_value_total = $value;
        $orderItem->save();

        //Updating of certificate when swapping cards should only be done on OrderItem which is confirmed or graded
        if (in_array($orderItem->order_item_status_id, [OrderItemStatus::CONFIRMED, OrderItemStatus::GRADED])) {
            $this->updateAgsCertificateCard($orderItem);
        }

        OrderItemCardChangedEvent::dispatch($orderItem, $previousCardProduct);

        return $orderItem->fresh();
    }

    protected function getCardFullName(CardProduct $card): string
    {
        return $card->isCardInformationComplete() ? $card->getSearchableName() : $card->name . ' (Added Manually)';
    }

    protected function getAddressData(OrderAddress $address): array
    {
        return [
            "ID" => $address->id,
            "FULL_NAME" => $address->first_name . " " . $address->last_name,
            "ADDRESS" => $address->address,
            "CITY" => $address->city,
            "STATE" => $address->state,
            "ZIP" => $address->zip,
            "COUNTRY" => $address->country->code,
            "PHONE" => $address->phone,
        ];
    }

    protected function getOrderPaymentText(array $orderPayment): string
    {
        if (array_key_exists('card', $orderPayment)) {
            return ucfirst($orderPayment["card"]["brand"]) . ' ending in ' . $orderPayment["card"]["last4"];
        } elseif (array_key_exists('payer', $orderPayment)) {
            return $orderPayment["payer"]["email"] . "\n" . $orderPayment["payer"]["name"];
        } elseif (array_key_exists('transaction', $orderPayment)) {
            return 'Collector Coin';
        }

        return '';
    }

    /**
     * @throws FailedExtraCharge|Throwable
     */
    public function addExtraCharge(Order $order, User $user, array $data, array $paymentResponse): void
    {
        DB::transaction(function () use ($order, $user, $data, $paymentResponse) {
            $order->updateAfterExtraCharge($data['amount']);

            $order->createOrderPayment($paymentResponse, $user);
        });

        ExtraChargeSuccessful::dispatch($order);
    }

    protected function updateAgsCertificateCard(OrderItem $orderItem): array
    {
        $data = $this->getOrderItemCertificateData($orderItem);

        return $this->agsService->createCertificates($data);
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

            $paymentMethodId = $refundedInWallet ? PaymentMethod::getWalletPaymentMethod()->id : null;

            $order->createOrderPayment($refundResponse, $user, $paymentMethodId);
        });

        RefundSuccessful::dispatch($order, $data);
    }
}
