<?php

namespace App\Services\Order;

use App\Models\OrderItem;
use App\Models\UserCard;

class ConfirmItemService
{
    public function process(OrderItem $orderItem): OrderItem
    {
        if (! $orderItem->userCard) {
            $userCard = new UserCard();
            $userCard->order_item_id = $orderItem->id;
            $userCard->user_id = $orderItem->order->user_id;
            $userCard->certificate_number = 'CALL_CERTIFICATE_NUMBER_SERVICE';
            $userCard->save();
        }

        return (new OrderItemsService)->markAsConfirmed($orderItem->fresh());
    }
}
