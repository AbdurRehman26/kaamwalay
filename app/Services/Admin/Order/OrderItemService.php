<?php

namespace App\Services\Admin\Order;

use App\Exceptions\API\Admin\Order\OrderItem\OrderItemDoesNotBelongToOrder;
use App\Models\OrderItemStatusHistory;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderItemStatus;
use App\Services\Order\UserCardService;
use Illuminate\Support\Collection;

class OrderItemService
{
    public function changeStatus(Order $order, OrderItem $item, array $request): OrderItem
    {
        if ($item->order_id !== $order->id) {
            throw new OrderItemDoesNotBelongToOrder;
        }

        $requestStatus = OrderItemStatus::whereCode($request['status'])->first();

        if (! ! $requestStatus && (! $item->orderItemStatus || $item->order_item_status_id !== $requestStatus->id)) {
            $status = new OrderItemStatusHistory();
            $status->order_item_id = $item->id;
            $status->order_item_status_id = $requestStatus->id;
            $status->notes = in_array($requestStatus->id, [OrderItemStatus::MISSING_STATUS,OrderItemStatus::NOT_ACCEPTED_STATUS]) ? ($request['notes'] ?? null) : null;
            $status->save();

            $item->order_item_status_id = $requestStatus->id;
            $item->save();

            if ($requestStatus->id === OrderItemStatus::CONFIRMED_STATUS && ! $item->userCard) {
                (new UserCardService)->createItemUserCard($item);
            }
        }

        return $item->fresh();
    }

    public function markItemsAsPending(Order $order, array $items): Collection
    {
        $processedItems = [];
        foreach ($items as $item) {
            $orderItem = OrderItem::find($item);
            $processedItems[] = $this->changeStatus($order, $orderItem, ["status" => "pending"]);
        }

        return collect($processedItems);
    }
}
