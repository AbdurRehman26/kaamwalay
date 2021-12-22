<?php

namespace App\Http\Controllers\API\V1\Customer\Order;

use App\Exceptions\API\Customer\Order\CustomerShipmentNotUpdated;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\Customer\Order\StoreOrderRequest;
use App\Http\Requests\API\Customer\Order\UpdateCustomerShipmentRequest;
use App\Http\Resources\API\Customer\Order\OrderCollection;
use App\Http\Resources\API\Customer\Order\OrderCreateResource;
use App\Http\Resources\API\Customer\Order\OrderCustomerShipmentResource;
use App\Http\Resources\API\Customer\Order\OrderResource;
use App\Models\Order;
use App\Services\Order\CreateOrderService;
use App\Services\Order\OrderService;
use App\Services\Order\Shipping\CustomerShipmentService;
use Exception;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class OrderController extends Controller
{
    public function __construct(
        private OrderService $orderService,
        private CreateOrderService $createOrderService
    ) {
//        $this->authorizeResource(Order::class, 'order');
    }

    public function index(): OrderCollection
    {
        return new OrderCollection(
            $this->orderService->getOrders()
        );
    }

    public function store(StoreOrderRequest $request): OrderCreateResource | JsonResponse
    {
        try {
            $order = $this->createOrderService->create($request->validated());
        } catch (Exception $e) {
            return new JsonResponse(
                [
                    'error' => $e->getMessage(),
                ],
                Response::HTTP_BAD_REQUEST
            );
        }

        return new OrderCreateResource($order);
    }

    public function show(int $orderId): OrderResource
    {
        $order = $this->orderService->getOrder($orderId);
        $this->authorize('view', $order);

        return new OrderResource($order);
    }

    public function updateCustomerShipment(UpdateCustomerShipmentRequest $request, Order $order, CustomerShipmentService $customerShipmentService): JsonResponse|OrderCustomerShipmentResource
    {
        $this->authorize('view', $order);

        try {
            $data = $request->safe()->only([
                'shipping_provider',
                'tracking_number',
            ]);

            $order = $customerShipmentService->process($order, $data['shipping_provider'], $data['tracking_number']);

            return new OrderCustomerShipmentResource($order->orderCustomerShipment);
        } catch (CustomerShipmentNotUpdated $e) {
            return new JsonResponse(
                [
                    'error' => $e->getMessage(),
                ],
                Response::HTTP_BAD_REQUEST
            );
        }
    }
}
