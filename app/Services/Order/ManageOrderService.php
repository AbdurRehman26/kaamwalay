<?php

namespace App\Services\Order;

use App\Exceptions\API\Admin\Order\OrderItem\ItemDontBelongToOrder;
use App\Models\Order;
use App\Models\OrderAdminStatus;
use App\Models\OrderItem;
use App\Models\User;

class ManageOrderService
{
    public function confirmReview(Order $order, User $user): Order
    {
        $order->order_admin_status_id = OrderAdminStatus::REVIEWED_STATUS;
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

        return (new OrderItemsService)->changeStatus($order, $newItem, ["status" => "confirmed"]);
    }

    public function editCard(Order $order, OrderItem $orderItem, int $card_id, float $value): OrderItem
    {
        if ($orderItem->order_id !== $order->id) {
            throw new ItemDontBelongToOrder;
        }

        $orderItem->card_product_id = $card_id;
        $orderItem->declared_value_per_unit = $value;
        $orderItem->declared_value_total = $value;
        $orderItem->save();

        return $orderItem;
    }
}
