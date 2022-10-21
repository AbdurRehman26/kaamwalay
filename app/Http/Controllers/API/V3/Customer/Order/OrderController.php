<?php

namespace App\Http\Controllers\API\V3\Customer\Order;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\V3\Customer\Order\StoreOrderRequest;
use App\Http\Resources\API\V3\Customer\Order\OrderCreateResource;
use App\Services\Order\V3\CreateOrderService;
use Exception;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class OrderController extends Controller
{
    public function __construct(
        protected CreateOrderService $createOrderService,
    ) {
        //
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

}
