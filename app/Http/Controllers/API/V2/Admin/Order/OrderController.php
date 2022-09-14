<?php

namespace App\Http\Controllers\API\V2\Admin\Order;

use App\Exceptions\API\Admin\Order\OrderCanNotBeCancelled;
use App\Exceptions\API\Admin\Order\OrderCanNotBeMarkedAsShipped;
use App\Exceptions\API\Admin\Order\OrderIsAlreadyCancelled;
use App\Http\Controllers\API\V1\Admin\Order\OrderController as V1OrderController;
use App\Http\Requests\API\V2\Admin\Order\StoreOrderRequest;
use App\Http\Requests\API\V2\Admin\Order\UpdateBillingAddressRequest;
use App\Http\Requests\API\V2\Admin\Order\UpdateShipmentRequest;
use App\Http\Resources\API\V2\Admin\Order\OrderCreateResource;
use App\Http\Resources\API\V2\Admin\Order\OrderListCollection;
use App\Http\Resources\API\V2\Admin\Order\OrderResource;
use App\Models\Order;
use App\Services\Admin\V2\OrderService;
use App\Services\Order\V2\CreateOrderService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class OrderController extends V1OrderController
{
    /**
     * @throws Throwable
     */
    public function processShipment(UpdateShipmentRequest $request, Order $order): OrderResource | JsonResponse
    {
        throw_unless($order->isPaid(), OrderCanNotBeMarkedAsShipped::class);

        try {
            DB::beginTransaction();
            /** @var OrderService $orderService */
            $orderService = resolve(OrderService::class);

            $orderService->shipOrder(
                $order,
                $request->only('shipping_provider', 'tracking_number')
            );

            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();

            return new JsonResponse(
                [
                    'error' => $e->getMessage(),
                ],
                Response::HTTP_BAD_REQUEST
            );
        }

        $order->refresh()->load('orderShipment');

        return new OrderResource($order);
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

    /**
     * @throws Throwable
     */
    public function destroy(Order $order): JsonResponse
    {
        throw_if($order->isPaid(), OrderCanNotBeCancelled::class);
        throw_if($order->isCancelled(), OrderIsAlreadyCancelled::class);

        /** @var OrderService $orderService */
        $orderService = resolve(OrderService::class);

        try {
            DB::beginTransaction();

            $orderService->cancelOrder($order, auth()->user());

            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            Log::error("Failed to cancel order $order->id", [
                'message' => $e->getMessage(),
            ]);

            return new JsonResponse(['message' => 'Failed to cancel order.'], $e->getCode());
        }

        return new JsonResponse([], Response::HTTP_NO_CONTENT);
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
