<?php

namespace App\Services\Admin\Order;

use App\Exceptions\API\Admin\Order\OrderItem\OrderItemDoesNotBelongToOrder;
use App\Exceptions\API\Admin\Order\OrderItem\OrderItemIsNotGraded;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderItemStatus;
use App\Models\OrderItemStatusHistory;
use App\Services\Admin\CardGradingService;
use App\Services\Order\UserCardService;
use Illuminate\Support\Collection;

class OrderItemService
{
    public function __construct(
        private  UserCardService $userCardService,
        private CardGradingService $cardGradingService
    ) {
    }

    /**
     * @throws OrderItemDoesNotBelongToOrder|OrderItemIsNotGraded
     */
    public function changeStatus(Order $order, OrderItem $item, array $request): OrderItem
    {
        if ($item->order_id !== $order->id) {
            throw new OrderItemDoesNotBelongToOrder;
        }

        /** @var OrderItemStatus $requestStatus */
        $requestStatus = OrderItemStatus::forStatus($request['status'])->first();

        if ($requestStatus->id === OrderItemStatus::GRADED
            && ! $this->cardGradingService->hasValidGradings($item->userCard)) {
            throw new OrderItemIsNotGraded;
        }

        if ($requestStatus && (! $item->orderItemStatus || $item->order_item_status_id !== $requestStatus->id)) {
            $status = new OrderItemStatusHistory();
            $status->order_item_id = $item->id;
            $status->order_item_status_id = $requestStatus->id;
            $status->user_id = auth()->user()->id;
            $status->notes = $request['notes'] ?? '';
            $status->save();

            $item->order_item_status_id = $requestStatus->id;
            $item->save();

            if ($requestStatus->id === OrderItemStatus::CONFIRMED && ! $item->userCard) {
                $this->userCardService->createItemUserCard($item);
            }
        }

        return $item->fresh();
    }

    /**
     * @throws OrderItemDoesNotBelongToOrder
     */
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
