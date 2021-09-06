<?php

namespace App\Http\Controllers\API\Customer\Order;

use App\Exceptions\API\Customer\Order\CustomerShipmentNotUpdated;
use App\Exceptions\API\Customer\Order\OrderNotPlaced;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\Customer\Order\StoreOrderRequest;
use App\Http\Requests\API\Customer\Order\UpdateCustomerShipmentRequest;
use App\Http\Requests\API\Customer\Order\AddExtraCardRequest;
use App\Http\Requests\API\Customer\Order\MarkItemsPendingRequest;
use App\Http\Requests\API\Customer\Order\OrderItem\ChangeStatusRequest;
use App\Http\Resources\API\Customer\Order\OrderCollection;
use App\Http\Resources\API\Customer\Order\OrderCreateResource;
use App\Http\Resources\API\Customer\Order\OrderResource;
use App\Http\Resources\API\Customer\Order\OrderItem\OrderItemResource;
use App\Models\Order;
use App\Models\OrderItem;
use App\Services\Order\CreateOrderService;
use App\Services\Order\Shipping\CustomerShipmentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\QueryBuilder;
use Symfony\Component\HttpFoundation\Response;
use App\Services\Order\ConfirmItemService;
use App\Services\Order\OrderItemsService;
use App\Services\Order\ManageOrderService;
use App\Http\Resources\API\Customer\Order\OrderItem\OrderItemCollection;

class OrderItemController extends Controller
{
    public function getOrderCards(Request $request, Order $order): JsonResponse
    {
        return new JsonResponse(
            [
                'data' => new OrderItemCollection(
                    OrderItem::forOrder($order)->get()
                ),
                'order' => [
                    'id' => $order->id,
                    'order_number' => $order->order_number
                ]
            ]
        );
    }

    public function changeStatus(ChangeStatusRequest $request, Order $order, OrderItem $orderItem, OrderItemsService $orderItemsService): OrderItemResource
    {
        // $this->authorize('review');

        //check if item belongs to order?

        $result = $orderItemsService->changeStatus($orderItem,$request->all());

        return new OrderItemResource($result);
    }

    public function bulkMarkAsPending(MarkItemsPendingRequest $request, Order $order, OrderItemsService $orderItemsService): OrderItemCollection
    {
        $result = $orderItemsService->markItemsAsPending($order, $request->items);

        return new OrderItemCollection($result);
    }

    public function store(AddExtraCardRequest $request, Order $order, ManageOrderService $manageOrderService): OrderItemResource
    {
        $result = $manageOrderService->addExtraCard($order,$request->card_id);
        return new OrderItemResource($result);
    }

    public function update(AddExtraCardRequest $request, Order $order, OrderItem $orderItem, ManageOrderService $manageOrderService): OrderItemResource
    {
        $result = $manageOrderService->editCard($order,$orderItem,$request->card_id);
        return new OrderItemResource($result);
    }
}
