<?php

namespace App\Http\Controllers\API\V2\Customer\Order;

use App\Http\Controllers\API\V1\Customer\Order\OrderController as V1OrderController;
use App\Http\Requests\API\V2\Customer\Order\CreditAndDiscountRequest;
use App\Http\Requests\API\V2\Customer\Order\StoreOrderRequest;
use App\Http\Requests\API\V2\Customer\Order\UpdateOrderAddressesRequest;
use App\Http\Requests\API\V2\Customer\Order\UpdateOrderStepRequest;
use App\Http\Resources\API\V2\Customer\Order\OrderCreateResource;
use App\Models\Order;
use App\Services\Order\OrderService;
use App\Services\Order\V1\CreateOrderService;
use App\Services\Order\V2\CreateOrderService as V2CreateOrderService;
use App\Services\Order\V2\CreditAndDiscountOrderService;
use App\Services\Order\V2\UpdateAddressOrderService;
use App\Services\Order\V2\CompleteOrderSubmissionService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class OrderController extends V1OrderController
{
    public function __construct(
        protected OrderService $orderService,
        protected V2CreateOrderService $v2createOrderService,
        protected CreateOrderService $createOrderService,
        protected UpdateAddressOrderService $updateAddressOrderService,
        protected CreditAndDiscountOrderService $creditAndDiscountOrderService,
        protected CompleteOrderSubmissionService $completeOrderSubmissionService
    ) {
        parent::__construct($orderService, $createOrderService);
    }

    public function updateOrderStep(UpdateOrderStepRequest $request, Order $order): JsonResponse
    {
        try {
            $order->order_step = $request->order_step;
            $order->save();
        } catch (Exception $e) {
            return new JsonResponse(
                [
                    'error' => $e->getMessage(),
                ],
                Response::HTTP_BAD_REQUEST
            );
        }
        return response()->json(['message' => 'success'], Response::HTTP_OK);
    }

    public function store(Request $request): OrderCreateResource | JsonResponse
    {
        $request = resolve(StoreOrderRequest::class);

        try {
            $order = $this->v2createOrderService->create($request->validated());
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

    public function storeAddresses(UpdateOrderAddressesRequest $request, Order $order): OrderCreateResource | JsonResponse
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

    public function storeCreditAndDiscount(CreditAndDiscountRequest $request, Order $order): OrderCreateResource | JsonResponse
    {
        try {
            $order = $this->creditAndDiscountOrderService->save($order, $request->validated());
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

    public function completeSubmission(Order $order): JsonResponse
    {
        try {
            $this->completeOrderSubmissionService->complete($order);
        } catch (Exception $e) {
            return new JsonResponse(
                [
                    'error' => $e->getMessage(),
                ],
                Response::HTTP_BAD_REQUEST
            );
        }

        return response()->json(['message' => 'success'], Response::HTTP_OK);
    }
}
