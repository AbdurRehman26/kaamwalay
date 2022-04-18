<?php

namespace App\Services\Order\V1;

use App\Events\API\Order\V1\OrderStatusChangedEvent;
use App\Http\Resources\API\V1\Customer\Order\OrderPaymentResource;
use App\Models\CardProduct;
use App\Models\Order;
use App\Models\OrderAddress;
use App\Models\OrderItem;
use App\Models\OrderItemStatus;
use App\Models\OrderItemStatusHistory;
use App\Models\OrderStatus;
use App\Models\OrderStatusHistory;
use App\Models\User;
use App\Services\Payment\V1\Providers\CollectorCoinService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Model;
use Spatie\QueryBuilder\QueryBuilder;

class OrderService
{
    public function getOrders(): LengthAwarePaginator
    {
        /* @var User $user */
        $user = auth()->user();
        $itemsPerPage = request('per_page');

        return QueryBuilder::for(Order::class)
            ->excludeCancelled()
            ->forUser($user)
            ->allowedIncludes(Order::getAllowedIncludes())
            ->allowedFilters(Order::getAllowedFilters())
            ->allowedSorts(['grand_total'])
            ->defaultSort('-orders.created_at')
            ->paginate($itemsPerPage);
    }

    public function getOrder(int $orderId): Model
    {
        return QueryBuilder::for(Order::class)
            ->allowedIncludes(Order::getAllowedIncludes())
            ->findOrFail($orderId);
    }

    public function getDataForCustomerSubmissionConfirmationEmail(Order $order): array
    {
        $data = [];

        $paymentPlan = $order->paymentPlan;
        $orderItems = $order->getGroupedOrderItems();
        $orderPayment = OrderPaymentResource::make($order->firstOrderPayment)->resolve();

        $data["SUBMISSION_NUMBER"] = $order->order_number;
        $data["SHIPPING_INSTRUCTIONS_URL"] = config('app.url') . '/dashboard/submissions/' . $order->id . '/confirmation';

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

        $data["SHIPPING_ADDRESS"] = $this->getAddressData($order->shippingAddress);
        $data["BILLING_ADDRESS"] = $this->getAddressData($order->billingAddress);

        $data["PAYMENT_METHOD"] = $this->getOrderPaymentText($orderPayment);

        return $data;
    }

    public function calculateCollectorCoinPrice(Order $order, int $paymentBlockchainNetwork): float
    {
        $orderPayment = $order->firstOrderPayment;

        // Would be 0 if there is no collector coin payment for this order, for example, it has been fully paid with wallet
        if (! $orderPayment) {
            return 0;
        }
        
        $collectorCoinPrice = (new CollectorCoinService)->getCollectorCoinPriceFromUsd($paymentBlockchainNetwork, $order->grand_total_to_be_paid);
        $orderPayment->response = json_encode(['amount' => $collectorCoinPrice, 'network' => $paymentBlockchainNetwork]);
        $orderPayment->update();

        return $collectorCoinPrice;
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

    public function cancelOrder(Order $order, User $user): void
    {
        $this->cancelOrderItems($order);

        $order->order_status_id = OrderStatus::CANCELLED;
        $order->save();

        OrderStatusHistory::create([
            'order_id' => $order->id,
            'order_status_id' => OrderStatus::CANCELLED,
            'user_id' => $user->id,
        ]);

        OrderStatusChangedEvent::dispatch($order, OrderStatus::find(OrderStatus::CANCELLED));
    }

    protected function cancelOrderItems(Order $order): void
    {
        $order->orderItems->each(function (OrderItem $orderItem) use ($order) {
            OrderItemStatusHistory::updateOrCreate([
                'order_item_id' => $orderItem->id,
                'order_item_status_id' => OrderItemStatus::CANCELLED,
                'user_id' => $order->user_id,
                'notes' => 'User cancelled the order.',
            ]);

            $orderItem->order_item_status_id = OrderItemStatus::CANCELLED;
            $orderItem->save();
        });
    }
}
