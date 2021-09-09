<?php

namespace App\Services\Admin\Order;

use App\Exceptions\API\Admin\Order\OrderItem\OrderItemDoesNotBelongToOrder;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;

class ManageOrderService
{
    public function confirmReview(Order $order, User $user): Order
    {
        $order->order_status_id = 3;
        $order->reviewed_by_id = $user->id;
        $order->reviewed_at = new \Datetime();
        $order->save();

        return $order;
    }

    public function addExtraCard(Order $order, int $card_id, float $value): OrderItem
    {
        $newItem = OrderItem::create([
            'order_id' => $order->id,
            'card_product_id' => $card_id,
            'quantity' => 1,
            'declared_value_per_unit' => $value,
            'declared_value_total' => $value,
        ]);

        return (new OrderItemService)->changeStatus($order, $newItem, ["status" => "confirmed"]);
    }

    public function editCard(Order $order, OrderItem $orderItem, int $card_id, float $value): OrderItem
    {
        if ($orderItem->order_id !== $order->id) {
            throw new OrderItemDoesNotBelongToOrder;
        }

        $orderItem->card_product_id = $card_id;
        $orderItem->declared_value_per_unit = $value;
        $orderItem->declared_value_total = $value;
        $orderItem->save();

        return $orderItem;
    }

    public function updateNotes(Order $order, $notes): Order
    {
        $order->notes = $notes;
        $order->save();

        return $order;
    }
}
