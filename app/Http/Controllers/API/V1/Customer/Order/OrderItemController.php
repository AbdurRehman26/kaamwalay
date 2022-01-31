<?php

namespace App\Http\Controllers\API\V1\Customer\Order;

use App\Exceptions\API\Admin\Order\OrderItem\OrderItemDoesNotBelongToOrder;
use App\Exceptions\API\Admin\Order\OrderItem\OrderItemIsNotGraded;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\V1\Admin\Order\OrderItem\UpdateOrderItemNotesRequest;
use App\Http\Requests\API\V1\Customer\Order\StoreOrderItemRequest;
use App\Http\Resources\API\V1\Customer\Order\OrderItem\OrderItemCollection;
use App\Models\Order;
use App\Models\OrderItem;
use App\Services\Admin\Order\OrderItemService;

class OrderItemController extends Controller
{
    public function index(Order $order): OrderItemCollection
    {
        return new OrderItemCollection($order->orderItems());
    }

    /**
     * @throws OrderItemDoesNotBelongToOrder
     * @throws OrderItemIsNotGraded
     */
    public function store(
        Order $order,
        StoreOrderItemRequest $request,
        OrderItemService $orderItemService
    ): OrderItemCollection {
        $orderItem = new OrderItem($request->validated());

        $order->orderItems()->save($orderItem);

        $orderItemService->changeStatus(
            $order,
            $orderItem,
            ['status' => 'pending'],
            $request->user()
        );

        return new OrderItemCollection($order->orderItems());
    }

    public function update(
        UpdateOrderItemNotesRequest $request,
        Order $order,
        OrderItem $orderItem
    ): OrderItemCollection {
        $orderItem->update($request->validated());

        return new OrderItemCollection($order->orderItems());
    }

    public function destroy(Order $order, OrderItem $orderItem): OrderItemCollection
    {
        $orderItem->deleteOrFail();

        return new OrderItemCollection($order->orderItems());
    }
}
