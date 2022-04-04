<?php

namespace App\Http\Controllers\API\V2\Customer\Order;

use App\Enums\Order\OrderStepEnum;
use App\Exceptions\API\Customer\Order\CustomerShipmentNotUpdated;
use App\Exceptions\API\Customer\Order\OrderCanNotCanceled;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\V2\Customer\Order\CalculateOrderCollectorCoinPriceRequest;
use App\Http\Requests\API\V2\Customer\Order\StoreOrderRequest;
use App\Http\Requests\API\V2\Customer\Order\UpdateBillingAddressRequest;
use App\Http\Requests\API\V2\Customer\Order\UpdateCustomerShipmentRequest;
use App\Http\Resources\API\V2\Customer\Order\OrderCollection;
use App\Http\Resources\API\V2\Customer\Order\OrderCreateResource;
use App\Http\Resources\API\V2\Customer\Order\OrderCustomerShipmentResource;
use App\Http\Resources\API\V2\Customer\Order\OrderResource;
use App\Models\Order;
use App\Models\OrderStatus;
use App\Services\Admin\V2\OrderStatusHistoryService;
use App\Services\Order\Shipping\CustomerShipmentService;
use App\Services\Order\V2\CreateOrderService;
use App\Services\Order\V2\OrderService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class OrderController extends Controller
{
    public function __construct(
        protected OrderService $orderService,
        protected CreateOrderService $createOrderService,
        protected OrderStatusHistoryService $orderStatusHistoryService
    ) {
//        $this->authorizeResource(Order::class, 'order');
    }

    public function index(): OrderCollection
    {
        return new OrderCollection(
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

    public function completeOrderSubmission(Order $order): JsonResponse
    {
        $order->order_step = OrderStepEnum::ORDER_SUBMITTED_STEP;
        $order->save();
        $this->orderStatusHistoryService->addStatusToOrder(OrderStatus::PLACED, $order);

        return response()->json(['message' => 'success'], Response::HTTP_OK);
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

    public function calculateCollectorCoinPrice(CalculateOrderCollectorCoinPriceRequest $request, Order $order): JsonResponse
    {
        $this->authorize('calculateCollectorCoin', $order);

        try {
            $blockchainNetworkChainId = $request->payment_blockchain_network ?? 1;
            $amount = $this->orderService->calculateCollectorCoinPrice(
                $order,
                $blockchainNetworkChainId,
                $request->input('payment_by_wallet'),
                $request->input('discounted_amount'),
            );

            return new JsonResponse(
                [
                    'value' => $amount,
                    'wallet' => config('web3networks')[$blockchainNetworkChainId]['collector_coin_wallet'],
                ],
                200
            );
        } catch (Exception $e) {
            return new JsonResponse(
                [
                    'error' => $e->getMessage(),
                    'value' => 0.0,
                    'wallet' => null,
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

    public function updateBillingAddress(Order $order, UpdateBillingAddressRequest $request)
    {
        $this->orderService->updateBillingAddress($order, $request->validated());

        return new JsonResponse([
            'success' => true,
            'message' => 'Billing Address Updated successfully.',
        ]);
    }
}
