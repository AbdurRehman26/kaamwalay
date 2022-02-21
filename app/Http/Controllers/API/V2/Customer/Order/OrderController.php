<?php

namespace App\Http\Controllers\API\V2\Customer\Order;

use App\Http\Controllers\API\V1\Customer\Order\OrderController as V1OrderController;
use App\Http\Requests\API\V1\Customer\Order\UpdateOrderAddressesRequest;
use App\Http\Requests\API\V2\Customer\Order\CompleteOrderRequest;
use App\Http\Requests\API\V2\Customer\Order\StoreOrderRequest;
use App\Http\Resources\API\V2\Customer\Order\OrderCreateResource;
use App\Models\Order;
use App\Services\Order\OrderService;
use App\Services\Order\V1\CreateOrderService;
use App\Services\Order\V2\CompleteOrderService;
use App\Services\Order\V2\StoreOrderService;
use App\Services\Order\V2\UpdateAddressOrderService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class OrderController extends V1OrderController
{
    public function __construct(
        protected OrderService $orderService,
        protected CreateOrderService $createOrderService,
        protected StoreOrderService $storeOrderService,
        protected UpdateAddressOrderService $updateAddressOrderService,
        protected CompleteOrderService $completeOrderService
    )
    {
        parent::__construct($orderService, $createOrderService);
    }

    public function store(Request $request): OrderCreateResource | JsonResponse
    {
        $request = resolve(StoreOrderRequest::class);
        try {
            $order = $this->storeOrderService->create($request->validated());
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

    public function storeOrderAddresses(UpdateOrderAddressesRequest $request, Order $order): OrderCreateResource | JsonResponse
    {
        try {
            $order = $this->updateAddressOrderService->save($order, $request->validated());
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

    public function completeOrder(CompleteOrderRequest $request, Order $order): OrderCreateResource | JsonResponse
    {
        try {
            $order = $this->completeOrderService->save($order, $request->validated());
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
