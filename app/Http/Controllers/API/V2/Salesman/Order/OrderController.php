<?php

namespace App\Http\Controllers\API\V2\Salesman\Order;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\V2\Salesman\Order\StoreOrderRequest;
use App\Http\Requests\API\V2\Salesman\Order\UpdateBillingAddressRequest;
use App\Http\Resources\API\V2\Salesman\Order\OrderCreateResource;
use App\Http\Resources\API\V2\Salesman\Order\OrderListCollection;
use App\Http\Resources\API\V2\Salesman\Order\OrderResource;
use App\Models\Order;
use App\Services\Salesman\V2\Order\CreateOrderService;
use App\Services\Salesman\V2\Order\OrderService;
use Exception;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class OrderController extends Controller
{
    public function __construct(protected OrderService $orderService)
    {
    }

    public function index(): OrderListCollection
    {
        $orders = $this->orderService->getOrders();

        return new OrderListCollection($orders);
    }

    public function show(int $orderId): OrderResource
    {
        $order = $this->orderService->getOrder($orderId);

        return new OrderResource($order);
    }

    public function store(StoreOrderRequest $request): OrderCreateResource | JsonResponse
    {
        try {
            $createOrderService = resolve(CreateOrderService::class);

            $order = $createOrderService->create($request->validated());
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

    public function updateBillingAddress(Order $order, UpdateBillingAddressRequest $request): JsonResponse
    {
        /** @var OrderService $orderService */
        $orderService = resolve(OrderService::class);
        $orderService->updateBillingAddress($order, $request->validated());

        return new JsonResponse([
            'success' => true,
            'message' => 'Billing Address Updated successfully.',
        ]);
    }
}
