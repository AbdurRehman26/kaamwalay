<?php

namespace App\Http\Controllers\API\V2\Admin\Order;

use App\Exceptions\API\Admin\Order\OrderCanNotBeCancelled;
use App\Exceptions\API\Admin\Order\OrderCanNotBeMarkedAsShipped;
use App\Exceptions\API\Admin\Order\OrderIsAlreadyCancelled;
use App\Exceptions\API\Admin\Order\OrderLabelCanNotBeGenerated;
use App\Exceptions\Services\AGS\AgsServiceIsDisabled;
use App\Exceptions\Services\AGS\OrderLabelCouldNotBeGeneratedException;
use App\Http\Controllers\API\V1\Admin\Order\OrderController as V1OrderController;
use App\Http\Requests\API\V2\Admin\Order\UpdateShipmentRequest;
use App\Http\Resources\API\V2\Admin\Order\OrderListCollection;
use App\Http\Resources\API\V2\Admin\Order\OrderResource;
use App\Models\Order;
use App\Models\OrderStatus;
use App\Services\Admin\Order\OrderLabelService;
use App\Services\Admin\V2\OrderService;
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

    /**
     * @throws OrderLabelCouldNotBeGeneratedException
     * @throws AgsServiceIsDisabled
     * @throws Throwable
     */
    public function generateLabel(Order $order): OrderResource
    {
        throw_if(
            $order->order_status_id >= OrderStatus::GRADED && $order->order_status_id !== OrderStatus::CANCELLED,
            new OrderLabelCanNotBeGenerated
        );

        /** @var OrderLabelService $orderLabelService */
        $orderLabelService = resolve(OrderLabelService::class);

        $orderLabelService->generateLabel($order);

        $order->load('orderLabel');

        return new OrderResource($order);
    }
}
