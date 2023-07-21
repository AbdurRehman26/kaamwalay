<?php

namespace App\Http\Controllers\API\V3\Salesman\Order;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\V3\Salesman\Order\UpdateShippingAddressRequest;
use App\Models\Order;
use App\Services\Salesman\V3\OrderService;
use Illuminate\Http\JsonResponse;

class OrderController extends Controller
{
    public function __construct(protected OrderService $orderService)
    {
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
