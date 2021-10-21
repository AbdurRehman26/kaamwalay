<?php

namespace App\Services\Admin;

use App\Events\API\Order\OrderStatusChangedEvent;
use App\Exceptions\API\Admin\Order\OrderCanNotBeMarkedAsGraded;
use App\Exceptions\API\Admin\OrderCanNotBeMarkedAsReviewed;
use App\Jobs\Admin\Order\CreateOrderFoldersOnDropbox;
use App\Models\Order;
use App\Models\OrderStatus;
use App\Models\OrderStatusHistory;
use App\Models\User;
use App\Services\AGS\AgsService;
use Carbon\Carbon;
use Spatie\QueryBuilder\QueryBuilder;
use Throwable;

class OrderStatusHistoryService
{
    public function __construct(
        protected AgsService $agsService,
        protected OrderService $orderService
    ) {
    }

    public function getAllByOrderId(Order|int $orderId)
    {
        return QueryBuilder::for(OrderStatusHistory::class)
            ->where('order_id', getModelId($orderId))
            ->allowedIncludes(OrderStatusHistory::getAllowedAdminIncludes())
            ->get();
    }

    /**
     * @throws OrderCanNotBeMarkedAsGraded|Throwable
     */
    public function addStatusToOrder(OrderStatus|int $orderStatus, Order|int $order, User|int $user = null, ?string $notes = null)
    {
        if (! $user) {
            /** @noinspection CallableParameterUseCaseInTypeContextInspection */
            $user = auth()->user();
        }

        $orderId = getModelId($order);
        $orderStatusId = getModelId($orderStatus);

        $orderStatusHistory = OrderStatusHistory::where('order_id', getModelId($order))
            ->where('order_status_id', getModelId($orderStatus))
            ->first();

        throw_if(
            getModelId($orderStatus) === OrderStatus::GRADED && ! Order::find($orderId)->isEligibleToMarkAsGraded(),
            OrderCanNotBeMarkedAsGraded::class
        );

        if ($orderStatusId === OrderStatus::ARRIVED) {
            $data = $this->orderService->getOrderCertificatesData($order);

            $response = $this->agsService->createCertificates($data);
            throw_if(empty($response), OrderCanNotBeMarkedAsReviewed::class);

            CreateOrderFoldersOnDropbox::dispatch($order);
        }

        $order = Order::find($orderId);
        $order->update(array_merge(
            [
                    'order_status_id' => $orderStatusId,
                ],
            $orderStatusId === OrderStatus::ARRIVED ? ['arrived_at' => Carbon::now()]: [],
        ));

        // TODO: replace find with the model.
        OrderStatusChangedEvent::dispatch(Order::find($orderId), OrderStatus::find($orderStatusId));

        if (! $orderStatusHistory) {
            $orderStatusHistory = OrderStatusHistory::create([
                'order_id' => $orderId,
                'order_status_id' => $orderStatusId,
                'user_id' => getModelId($user),
                'notes' => $notes,
            ]);
        }

        if (getModelId($orderStatus) === OrderStatus::SHIPPED) {
            $orderStatusHistory->user_id = getModelId($user);
            $orderStatusHistory->notes = $notes;
            $orderStatusHistory->save();
        }

        return QueryBuilder::for(OrderStatusHistory::class)
            ->where('id', $orderStatusHistory->id)
            ->allowedIncludes(OrderStatusHistory::getAllowedAdminIncludes())
            ->first();
    }
}
