<?php

namespace App\Services\Admin\Order;

use App\Exceptions\API\Admin\Order\OrderItem\OrderItemDoesNotBelongToOrder;
use App\Exceptions\API\Admin\Order\OrderItem\OrderItemIsNotGraded;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderItemStatus;
use App\Models\OrderItemStatusHistory;
use App\Models\User;
use App\Services\Admin\CardGradingService;
use App\Services\Order\UserCardService;
use Illuminate\Contracts\Auth\Authenticatable;
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
    public function changeStatus(Order $order, OrderItem $item, array $request, Authenticatable $user): OrderItem
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

        if ($item->order_item_status_id === $requestStatus->id) {
            $orderItemStatusHistory = OrderItemStatusHistory::where('order_item_id', $item->id)
                ->where('order_item_status_id', $item->order_item_status_id)
                ->first();
            $this->updateStatusNotes($orderItemStatusHistory, $request['notes'] ?? '', $user->id);
        }

        if ($requestStatus && (! $item->orderItemStatus || $item->orderItemStatusHistory()->count() < 1 || $item->order_item_status_id !== $requestStatus->id)) {
            $status = new OrderItemStatusHistory();
            $status->order_item_id = $item->id;
            $status->order_item_status_id = $requestStatus->id;
            $status->user_id = $user->id;
            $status->notes = $request['notes'] ?? '';
            $status->save();

            $item->order_item_status_id = $requestStatus->id;
            $item->save();

            if ($requestStatus->id === OrderItemStatus::PENDING) {
                OrderItemStatusHistory::query()->where('order_item_id', $item->id)
                ->where('order_item_status_id', '>', $requestStatus->id)
                ->delete();
            }

            if ($requestStatus->id === OrderItemStatus::CONFIRMED && ! $item->userCard) {
                $this->userCardService->createItemUserCard($item);
            }
        }

        return $item->fresh();
    }

    /**
     * @throws OrderItemDoesNotBelongToOrder
     */
    public function markItemsAsPending(Order $order, array $items, User $user): Collection
    {
        $processedItems = [];
        foreach ($items as $item) {
            $orderItem = OrderItem::find($item);
            $processedItems[] = $this->changeStatus($order, $orderItem, ["status" => "pending"], $user);
        }

        return collect($processedItems);
    }

    protected function updateStatusNotes(OrderItemStatusHistory $orderItemStatusHistory, string $notes, int $userId): bool
    {
        $orderItemStatusHistory->fill([
            'notes' => $notes,
            'user_id' => $userId,
        ]);

        return $orderItemStatusHistory->save();
    }
}
