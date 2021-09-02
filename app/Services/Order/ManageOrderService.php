<?php

namespace App\Services\Order;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderAdminStatus;
use App\Services\Order\OrderItemsService;

class ManageOrderService
{

    public function confirmReview(Order $order): Order
    {
        $order->order_admin_status_id = OrderAdminStatus::REVIEWED_STATUS;
        $order->order_status_id = 3;
        $order->save();

        return $order;
    }


    public function addExtraCard(Order $order, int $card_id): OrderItem
    {
        $newItem =  OrderItem::create([
            'order_id' => $order->id,
            'card_product_id' => $card_id,
            'quantity' => 1,
            'declared_value_per_unit' => 0,
            'declared_value_total' => 0,
        ]);

        return (new OrderItemsService)->markAsPending($newItem);
    }



    public function editCard(Order $order, OrderItem $orderItem, int $card_id): OrderItem
    {
        $orderItem->card_product_id = $card_id;
        $orderItem->save();

        return (new OrderItemsService)->markAsPending($orderItem);
    }
}
