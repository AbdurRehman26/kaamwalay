<?php

namespace App\Http\Controllers\API\V1\Customer\Order;

use App\Exceptions\API\Admin\Order\OrderItem\OrderItemDoesNotBelongToOrder;
use App\Exceptions\API\Admin\Order\OrderItem\OrderItemIsNotGraded;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\V1\Customer\Order\DeleteOrderItemRequest;
use App\Http\Requests\API\V1\Customer\Order\StoreOrderItemRequest;
use App\Http\Requests\API\V1\Customer\Order\UpdateOrderItemRequest;
use App\Http\Resources\API\V1\Customer\Order\OrderItem\OrderItemCollection;
use App\Models\Order;
use App\Models\OrderItem;
use App\Services\Admin\Order\OrderItemService;

class OrderItemController extends Controller
{
    public function index(Order $order): OrderItemCollection
    {
        return new OrderItemCollection($order->orderItems);
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
        $orderItem = new OrderItem(
            array_merge(
                $request->validated(),
                $this->getTotalDeclaredValue($request->only('quantity', 'declared_value_per_unit'))
            )
        );

        $order->orderItems()->save($orderItem);

        $orderItemService->changeStatus(
            $order,
            $orderItem,
            ['status' => 'pending'],
            $request->user()
        );

        return new OrderItemCollection($order->orderItems);
    }

    public function update(
        UpdateOrderItemRequest $request,
        Order $order,
        OrderItem $orderItem
    ): OrderItemCollection {
        $orderItem->update(
            array_merge(
                $request->validated(),
                $this->getTotalDeclaredValue($request->only('quantity', 'declared_value_per_unit'))
            )
        );

        return new OrderItemCollection($order->orderItems);
    }

    public function destroy(
        Order $order,
        OrderItem $orderItem,
        DeleteOrderItemRequest $request
    ): OrderItemCollection {
        $orderItem->deleteOrFail();

        return new OrderItemCollection($order->orderItems);
    }

    /**
     * @param array<string, int|float> $data
     *
     * @return array<string, float>
     */
    protected function getTotalDeclaredValue(array $data): array
    {
        return [
            'declared_value_total' => $data['declared_value_per_unit'] * $data['quantity'],
        ];
    }
}
