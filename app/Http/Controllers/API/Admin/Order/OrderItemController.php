<?php

namespace App\Http\Controllers\API\Admin\Order;

use App\Exceptions\API\Admin\Order\OrderItem\OrderItemDoesNotBelongToOrder;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\Admin\Order\AddExtraCardRequest;
use App\Http\Requests\API\Admin\Order\MarkItemsPendingRequest;
use App\Http\Requests\API\Admin\Order\OrderItem\ChangeStatusRequest;
use App\Http\Requests\API\Admin\Order\OrderItem\UpdateOrderItemNotesRequest;
use App\Http\Resources\API\Admin\Order\OrderItem\OrderItemCollection;
use App\Http\Resources\API\Admin\Order\OrderItem\OrderItemResource;
use App\Models\Order;
use App\Models\OrderItem;
use App\Services\Admin\Order\OrderItemService;
use App\Services\Admin\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class OrderItemController extends Controller
{
    public function getOrderCards(Request $request, Order $order): JsonResponse
    {
        // TODO Fix the structure of response. It is not following the usual response pattern
        return new JsonResponse(
            [
                'data' => new OrderItemCollection(
                    OrderItem::forOrder($order)->get()
                ),
                'order' => [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                ],
            ]
        );
    }

    public function store(AddExtraCardRequest $request, Order $order, OrderService $orderService): OrderItemResource
    {
        $this->authorize('review', $order);

        $result = $orderService->addExtraCard($order, $request->user(), $request->card_id, $request->value);

        return new OrderItemResource($result);
    }

    public function update(AddExtraCardRequest $request, Order $order, OrderItem $orderItem, OrderService $orderService): OrderItemResource | JsonResponse
    {
        $this->authorize('review', $order);

        try {
            $result = $orderService->editCard($order, $orderItem, $request->card_id, $request->value);

            return new OrderItemResource($result);
        } catch (OrderItemDoesNotBelongToOrder $e) {
            return new JsonResponse(
                [
                    'error' => $e->getMessage(),
                ],
                Response::HTTP_BAD_REQUEST
            );
        }
    }

    public function changeStatus(ChangeStatusRequest $request, Order $order, OrderItem $orderItem, OrderItemService $orderItemService): OrderItemResource | JsonResponse
    {
        $this->authorize('review', $order);

        try {
            $result = $orderItemService->changeStatus($order, $orderItem, $request->all(), $request->user());

            return new OrderItemResource($result);
        } catch (OrderItemDoesNotBelongToOrder $e) {
            return new JsonResponse(
                [
                    'error' => $e->getMessage(),
                ],
                Response::HTTP_BAD_REQUEST
            );
        }
    }

    public function changeStatusBulk(MarkItemsPendingRequest $request, Order $order, OrderItemService $orderItemService): OrderItemCollection | JsonResponse
    {
        $this->authorize('review', $order);

        try {
            $result = $orderItemService->markItemsAsPending($order, $request->items, $request->user());

            return new OrderItemCollection($result);
        } catch (OrderItemDoesNotBelongToOrder $e) {
            return new JsonResponse(
                [
                    'error' => $e->getMessage(),
                ],
                Response::HTTP_BAD_REQUEST
            );
        }
    }

    public function updateNotes(
        UpdateOrderItemNotesRequest $request,
        Order $order,
        OrderItem $orderItem
    ): OrderItemResource {
        $orderItem->update($request->only('notes'));

        return new OrderItemResource($orderItem);
    }
}
