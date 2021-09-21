<?php

namespace App\Http\Controllers\API\Admin\Order;

use App\Exceptions\API\Admin\IncorrectOrderStatus;
use App\Exceptions\API\Admin\Order\ShipmentNotUpdated;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\Admin\Order\UpdateNotesRequest;
use App\Http\Resources\API\Admin\Order\OrderItem\OrderItemShipmentResource;
use App\Http\Requests\API\Admin\Order\UpdateShipmentRequest;
use App\Http\Resources\API\Admin\Order\OrderListCollection;
use App\Http\Resources\API\Admin\Order\OrderResource;
use App\Http\Resources\API\Admin\Order\UserCardCollection;
use App\Models\Order;
use App\Services\Admin\Order\ShipmentService;
use App\Services\Admin\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class OrderController extends Controller
{
    public function __construct(
        private OrderService $ordersService
    ) {
    }

    public function index(): OrderListCollection
    {
        $orders = $this->ordersService->getOrders();

        return new OrderListCollection($orders);
    }

    public function show(int $orderId): OrderResource
    {
        $order = $this->ordersService->getOrder($orderId);

        return new OrderResource($order);
    }

    public function updateShipment(UpdateShipmentRequest $request, Order $order, ShipmentService $shipmentService): OrderItemShipmentResource | JsonResponse
    {
        try {
            $result = $shipmentService->updateShipment($order, $request->shipping_provider, $request->tracking_number);
        } catch (ShipmentNotUpdated $e) {
            return new JsonResponse(
                [
                    'error' => $e->getMessage(),
                ],
                Response::HTTP_BAD_REQUEST
            );
        }
        return new OrderItemShipmentResource($result);
    }

    public function updateNotes(UpdateNotesRequest $request, Order $order, OrderService $orderService): OrderResource
    {
        return new OrderResource($orderService->updateNotes($order, $request->notes));
    }

    public function completeReview(Request $request, Order $order, OrderService $orderService): OrderResource
    {
        $this->authorize('review', $order);

        return new OrderResource($orderService->confirmReview($order, $request->user()));
    }

    public function getGrades(Request $request, Order $order, OrderService $orderService): UserCardCollection | JsonResponse
    {
        $this->authorize('review', $order);

        try {
            $userCards = $orderService->getGrades($order);
        } catch (IncorrectOrderStatus $e) {
            return new JsonResponse(
                [
                    'error' => $e->getMessage(),
                ],
                Response::HTTP_BAD_REQUEST
            );
        }

        return new UserCardCollection($userCards);
    }
}
