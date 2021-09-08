<?php

namespace App\Http\Controllers\API\Admin\Order;

use App\Exceptions\API\Admin\Order\OrderItem\ItemDontBelongToOrder;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\Admin\Order\AddExtraCardRequest;
use App\Http\Requests\API\Admin\Order\MarkItemsPendingRequest;
use App\Http\Requests\API\Admin\Order\OrderItem\ChangeStatusRequest;
use App\Http\Resources\API\Customer\Order\OrderItem\OrderItemCollection;
use App\Http\Resources\API\Customer\Order\OrderItem\OrderItemResource;
use App\Models\Order;
use App\Models\OrderItem;
use App\Services\Order\ManageOrderService;
use App\Services\Order\OrderItemsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class OrderItemController extends Controller
{
    public function getOrderCards(Request $request, Order $order): JsonResponse
    {
        $this->authorize('review', $order);

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

    public function store(AddExtraCardRequest $request, Order $order, ManageOrderService $manageOrderService): OrderItemResource
    {
        $this->authorize('review', $order);

        $result = $manageOrderService->addExtraCard($order, $request->card_id, $request->value);

        return new OrderItemResource($result);
    }

    public function update(AddExtraCardRequest $request, Order $order, OrderItem $orderItem, ManageOrderService $manageOrderService): OrderItemResource | JsonResponse
    {
        $this->authorize('review', $order);

        try {
            $result = $manageOrderService->editCard($order, $orderItem, $request->card_id, $request->value);

            return new OrderItemResource($result);
        } catch (ItemDontBelongToOrder $e) {
            return new JsonResponse(
                [
                    'error' => $e->getMessage(),
                ],
                Response::HTTP_BAD_REQUEST
            );
        }
    }

    public function changeStatus(ChangeStatusRequest $request, Order $order, OrderItem $orderItem, OrderItemsService $orderItemsService): OrderItemResource | JsonResponse
    {
        $this->authorize('review', $order);

        try {
            $result = $orderItemsService->changeStatus($order, $orderItem, $request->all());

            return new OrderItemResource($result);
        } catch (ItemDontBelongToOrder $e) {
            return new JsonResponse(
                [
                    'error' => $e->getMessage(),
                ],
                Response::HTTP_BAD_REQUEST
            );
        }
    }

    public function bulkMarkAsPending(MarkItemsPendingRequest $request, Order $order, OrderItemsService $orderItemsService): OrderItemCollection
    {
        $this->authorize('review', $order);

        try {
            $result = $orderItemsService->markItemsAsPending($order, $request->items);

            return new OrderItemCollection($result);
        } catch (ItemDontBelongToOrder $e) {
            return new JsonResponse(
                [
                    'error' => $e->getMessage(),
                ],
                Response::HTTP_BAD_REQUEST
            );
        }
    }
}
