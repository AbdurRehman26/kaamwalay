<?php

namespace App\Http\Controllers\API\V3\Customer\Order;

use App\Exceptions\API\Customer\Order\CustomerShipmentNotUpdated;
use App\Exceptions\API\Customer\Order\OrderCanNotCanceled;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\V3\Customer\Order\StoreOrderRequest;
use App\Http\Requests\API\V3\Customer\Order\UpdateCustomerShipmentRequest;
use App\Http\Resources\API\V3\Customer\Order\OrderCreateResource;
use App\Http\Resources\API\V3\Customer\Order\OrderCustomerShipmentResource;
use App\Http\Resources\API\V3\Customer\Order\OrderListResource;
use App\Http\Resources\API\V3\Customer\Order\OrderResource;
use App\Models\Order;
use App\Models\OrderStatus;
use App\Services\Order\Shipping\CustomerShipmentService;
use App\Services\Order\V3\CreateOrderService;
use App\Services\Order\V3\OrderService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class OrderController extends Controller
{
    public function __construct(
        protected CreateOrderService $createOrderService,
        protected OrderService $orderService,
    ) {
        //
    }

    public function index(): AnonymousResourceCollection
    {
        return OrderListResource::collection(
            $this->orderService->getOrders()
        );
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

    public function show(int $orderId): OrderResource
    {
        $order = $this->orderService->getOrder($orderId);
        $this->authorize('view', $order);

        return new OrderResource($order);
    }

    public function updateCustomerShipment(UpdateCustomerShipmentRequest $request, Order $order, CustomerShipmentService $customerShipmentService): JsonResponse|OrderCustomerShipmentResource
    {
        $this->authorize('view', $order);

        try {
            $data = $request->safe()->only([
                'shipping_provider',
                'tracking_number',
            ]);

            $order = $customerShipmentService->process($order, $data['shipping_provider'], $data['tracking_number']);

            return new OrderCustomerShipmentResource($order->orderCustomerShipment);
        } catch (CustomerShipmentNotUpdated $e) {
            return new JsonResponse(
                [
                    'error' => $e->getMessage(),
                ],
                Response::HTTP_BAD_REQUEST
            );
        }
    }

    /**
     * @throws Throwable
     */
    public function destroy(Order $order): JsonResponse
    {
        throw_if($order->order_status_id !== OrderStatus::PAYMENT_PENDING, OrderCanNotCanceled::class);

        try {
            DB::beginTransaction();

            $this->orderService->cancelOrder($order, auth()->user());

            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();

            return new JsonResponse(['message' => 'Failed to delete order!'], $e->getCode());
        }

        return new JsonResponse([], Response::HTTP_NO_CONTENT);
    }
}
