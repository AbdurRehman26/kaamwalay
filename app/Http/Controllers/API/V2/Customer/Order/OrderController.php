<?php

namespace App\Http\Controllers\API\V2\Customer\Order;

use App\Http\Controllers\API\V1\Customer\Order\OrderController as V1OrderController;
use App\Http\Requests\API\V2\Customer\Order\StoreOrderRequest;
use App\Http\Resources\API\V2\Customer\Order\OrderCreateResource;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class OrderController extends V1OrderController
{
    public function store(Request $request): OrderCreateResource | JsonResponse
    {
        $request = resolve(StoreOrderRequest::class);

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
}
