<?php

namespace App\Http\Controllers\API\V3\Admin\Order;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\V3\Admin\Order\StoreOrderRequest;
use App\Http\Resources\API\V3\Admin\Order\OrderCreateResource;
use App\Http\Resources\API\V3\Admin\Order\OrderResource;
use App\Services\Admin\V3\CreateOrderService;
use App\Services\Admin\V3\OrderService;
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
}
