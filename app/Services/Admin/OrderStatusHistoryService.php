<?php

namespace App\Services\Admin;

use App\Exceptions\API\Admin\OrderStatusHistoryWasAlreadyAssigned;
use App\Models\Order;
use App\Models\OrderStatus;
use App\Models\OrderStatusHistory;
use App\Models\User;
use Carbon\Carbon;
use Spatie\QueryBuilder\QueryBuilder;
use Throwable;

class OrderStatusHistoryService
{
    public function getAllByOrderId(Order|int $orderId)
    {
        return QueryBuilder::for(OrderStatusHistory::class)
            ->where('order_id', getModelId($orderId))
            ->allowedIncludes(OrderStatusHistory::getAllowedAdminIncludes())
            ->get();
    }

    /**
     * @throws OrderStatusHistoryWasAlreadyAssigned|Throwable
     */
    public function addStatusToOrder(OrderStatus|int $orderStatus, Order|int $order, User|int $user = null, ?string $notes = null)
    {
        if (! $user) {
            /** @noinspection CallableParameterUseCaseInTypeContextInspection */
            $user = auth()->user();
        }

        $orderId = getModelId($order);
        $orderStatusId = getModelId($orderStatus);

        $exists = OrderStatusHistory::query()
            ->where('order_id', getModelId($order))
            ->where('order_status_id', getModelId($orderStatus))
            ->exists();

        throw_if($exists, OrderStatusHistoryWasAlreadyAssigned::class);

        Order::query()
            ->where('id', $orderId)
            ->update(array_merge(
                [
                    'order_status_id' => $orderStatusId,
                ],
                $orderStatusId === OrderStatus::ARRIVED ? ['arrived_at' => Carbon::now()]: []
            ));

        $orderStatusHistory = OrderStatusHistory::create([
            'order_id' => $orderId,
            'order_status_id' => $orderStatusId,
            'user_id' => getModelId($user),
            'notes' => $notes,
        ]);
        
        return QueryBuilder::for(OrderStatusHistory::class)
            ->where('id', $orderStatusHistory->id)
            ->allowedIncludes(OrderStatusHistory::getAllowedAdminIncludes())
            ->first();
    }
}
