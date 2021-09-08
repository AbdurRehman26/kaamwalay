<?php

namespace App\Services\Order;

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


    public function addExtraCard(Order $order, int $card_id): OrderItem
    {
        $newItem = OrderItem::create([
            'order_id' => $order->id,
            'card_product_id' => $card_id,
            'quantity' => 1,
            'declared_value_per_unit' => 0,
            'declared_value_total' => 0,
        ]);

        return (new OrderItemsService)->changeStatus($newItem, ["status" => "confirmed"]);
    }



    public function editCard(Order $order, OrderItem $orderItem, int $card_id): OrderItem
    {
        $orderItem->card_product_id = $card_id;
        $orderItem->save();

        return $orderItem;
    }
}
