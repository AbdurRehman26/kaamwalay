<?php

namespace App\Http\Controllers\API\V3\Salesman\Order;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\V3\Salesman\Order\StoreOrderRequest;
use App\Http\Requests\API\V3\Salesman\Order\UpdateShippingAddressRequest;
use App\Http\Resources\API\V3\Salesman\Order\OrderCreateResource;
use App\Http\Resources\API\V3\Salesman\Order\OrderResource;
use App\Models\Order;
use App\Services\Salesman\V3\Order\CreateOrderService;
use App\Services\Salesman\V3\OrderService;
use Exception;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class OrderController extends Controller
{
    public function __construct(protected OrderService $orderService)
    {
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

    public function updateShippingAddress(Order $order, UpdateShippingAddressRequest $request): JsonResponse
    {
        $this->orderService->updateShippingAddress($order, $request->validated());

        return new JsonResponse([
            'success' => true,
            'message' => 'Shipping Address Updated successfully.',
        ]);
    }
}
