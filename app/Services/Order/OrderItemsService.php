<?php

namespace App\Services\Order;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderItemStatus;
use App\Models\ItemStatus;

class OrderItemsService
{

    public function markAsConfirmed(OrderItem $item): OrderItem
    {
        $latestStatus = $item->itemStatuses()->latest()->first();

        if(!$latestStatus || $latestStatus->order_item_status_id !== OrderItemStatus::CONFIRMED_STATUS ){

            $status = new ItemStatus();
            $status->order_item_id = $item->id;
            $status->order_item_status_id = OrderItemStatus::CONFIRMED_STATUS;
            $status->save();
        }

        return $item;
    }

    public function markAsMissing(OrderItem $item): OrderItem
    {
        $latestStatus = $item->itemStatuses()->latest()->first();

        if(!$latestStatus || $latestStatus->order_item_status_id !== OrderItemStatus::MISSING_STATUS ){

            $status = new ItemStatus();
            $status->order_item_id = $item->id;
            $status->order_item_status_id = OrderItemStatus::MISSING_STATUS;
            $status->save();
        }

        return $item;
    }

    public function markAsPending(OrderItem $item): OrderItem
    {
        $latestStatus = $item->itemStatuses()->latest()->first();

        if(!$latestStatus || $latestStatus->order_item_status_id !== OrderItemStatus::PENDING_STATUS ){

            $status = new ItemStatus();
            $status->order_item_id = $item->id;
            $status->order_item_status_id = OrderItemStatus::PENDING_STATUS;
            $status->save();
        }

        return $item;
    }

    public function markItemsAsPending(Order $order, array $items)
    {
        $processedItems = [];
        foreach($items as $item){
            $orderItem = OrderItem::find($item);
            $processedItems[] = $this->markAsPending($orderItem);
        }

        return collect($processedItems);
    }

}
