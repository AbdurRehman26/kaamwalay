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
    public function changeStatus(Order $order, OrderItem $item, array $request, User $user): OrderItem
    {
        if ($item->order_id !== $order->id) {
            throw new OrderItemDoesNotBelongToOrder;
        }

        /** @var OrderItemStatus $requestStatus */
        $requestStatus = OrderItemStatus::forStatus($request['status'])->firstOrFail();

        // Prevent setting item graded if the item has invalid gradings.
        if ($requestStatus->id === OrderItemStatus::GRADED
            && ! $this->cardGradingService->hasValidGradings($item->userCard)) {
            throw new OrderItemIsNotGraded;
        }

        // When we set item as pending, everything excluding status pending should be removed.
        if ($requestStatus->id === OrderItemStatus::PENDING) {
            OrderItemStatusHistory::query()->where('order_item_id', $item->id)
                ->where('order_item_status_id', '>', $requestStatus->id)
                ->delete();
        }

        // Grab the item history that match the order item and status.
        $orderItemStatusHistory = OrderItemStatusHistory::where('order_item_id', $item->id)
            ->where('order_item_status_id', $requestStatus->id)
            ->first();

        // In case it's not there create the history item.
        if (! $orderItemStatusHistory) {
            $orderItemStatusHistory = new OrderItemStatusHistory();
            $orderItemStatusHistory->order_item_id = $item->id;
            $orderItemStatusHistory->order_item_status_id = $requestStatus->id;
            $orderItemStatusHistory->user_id = $user->id;
            $orderItemStatusHistory->notes = $request['notes'] ?? '';
            $orderItemStatusHistory->save();
        }

        // Update notes and user id
        $this->updateStatusNotes($orderItemStatusHistory, $request['notes'] ?? '', $user->id);

        // Assign the status as current status to the item.
        $item->order_item_status_id = $requestStatus->id;
        $item->save();

        // When item is marked as confirmed create the user card details.
        if ($requestStatus->id === OrderItemStatus::CONFIRMED && ! $item->userCard) {
            $this->userCardService->createItemUserCard($item);
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
