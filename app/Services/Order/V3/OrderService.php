<?php

namespace  App\Services\Order\V3;

use App\Events\API\Order\V1\OrderStatusChangedEvent;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderItemStatus;
use App\Models\OrderItemStatusHistory;
use App\Models\OrderStatus;
use App\Models\OrderStatusHistory;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Model;
use Spatie\QueryBuilder\QueryBuilder;

class OrderService
{
    // @phpstan-ignore-next-line
    public function getOrders(): LengthAwarePaginator
    {
        /* @var User $user */
        $user = auth()->user();
        $itemsPerPage = request('per_page');

        $query = Order::forUser($user)
            ->excludeCancelled()
            ->withSum('orderItems as number_of_cards', 'quantity')
            ->withSum('orderItems as total_declared_value', 'declared_value_total');

        return QueryBuilder::for($query)
            ->allowedIncludes(Order::getAllowedIncludes())
            ->allowedFilters(Order::getAllowedFilters())
            ->defaultSort('-orders.created_at')
            ->paginate($itemsPerPage);
    }

    public function getOrder(int $orderId): Model
    {
        return QueryBuilder::for(Order::class)
            ->allowedIncludes(Order::getAllowedIncludes())
            ->findOrFail($orderId);
    }

    public function cancelOrder(Order $order, User $user): void
    {
        $this->cancelOrderItems($order);

        $order->order_status_id = OrderStatus::CANCELLED;
        $order->save();

        OrderStatusHistory::create([
            'order_id' => $order->id,
            'order_status_id' => OrderStatus::CANCELLED,
            'user_id' => $user->id,
        ]);

        OrderStatusChangedEvent::dispatch($order, OrderStatus::find(OrderStatus::CANCELLED));
    }

    protected function cancelOrderItems(Order $order): void
    {
        $order->orderItems->each(function (OrderItem $orderItem) use ($order) {
            OrderItemStatusHistory::updateOrCreate([
                'order_item_id' => $orderItem->id,
                'order_item_status_id' => OrderItemStatus::CANCELLED,
                'user_id' => $order->user_id,
                'notes' => 'User cancelled the order.',
            ]);

            $orderItem->order_item_status_id = OrderItemStatus::CANCELLED;
            $orderItem->save();
        });
    }
}
