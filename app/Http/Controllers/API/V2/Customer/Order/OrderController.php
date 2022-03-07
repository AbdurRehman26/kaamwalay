<?php

namespace App\Http\Controllers\API\V2\Customer\Order;

use App\Exceptions\API\Customer\Order\OrderCanNotCanceled;
use App\Http\Requests\API\V2\Customer\Order\CreditAndDiscountRequest;
use App\Exceptions\API\Customer\Order\CustomerShipmentNotUpdated;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\V2\Customer\Order\CalculateOrderCollectorCoinPriceRequest;
use App\Http\Requests\API\V2\Customer\Order\StoreOrderRequest;
use App\Http\Requests\API\V2\Customer\Order\UpdateCustomerShipmentRequest;
use App\Http\Requests\API\V2\Customer\Order\UpdateOrderAddressesRequest;
use App\Http\Requests\API\V2\Customer\Order\UpdateOrderStepRequest;
use App\Http\Resources\API\V2\Customer\Order\OrderCollection;
use App\Http\Resources\API\V2\Customer\Order\OrderCreateResource;
use App\Http\Resources\API\V2\Customer\Order\OrderCustomerShipmentResource;
use App\Http\Resources\API\V2\Customer\Order\OrderResource;
use App\Models\Order;
use App\Models\OrderStatus;
use App\Services\Order\OrderService;
use App\Services\Order\V2\CreateOrderService;
use App\Services\Order\V2\CompleteOrderSubmissionService;
use App\Services\Order\V2\CreditAndDiscountOrderService;
use App\Services\Order\Shipping\CustomerShipmentService;
use App\Services\Order\V2\UpdateAddressOrderService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class OrderController extends Controller
{
    public function __construct(
        protected OrderService $orderService,
        protected CreateOrderService $createOrderService,
        protected UpdateAddressOrderService $updateAddressOrderService,
        protected CreditAndDiscountOrderService $creditAndDiscountOrderService,
        protected CompleteOrderSubmissionService $completeOrderSubmissionService
    ) {
//        $this->authorizeResource(Order::class, 'order');
    }

    public function index(): OrderCollection
    {
        return new OrderCollection(
            $this->orderService->getOrders()
        );
    }

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
            $collectorCoinPrice = $this->orderService->calculateCollectorCoinPrice($order, $blockchainNetworkChainId);

            return new JsonResponse(
                [
                    'value' => $collectorCoinPrice,
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

        $this->orderService->cancelOrder($order, auth()->user());

        return new JsonResponse([], Response::HTTP_NO_CONTENT);
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

    public function completeSubmission(Order $order): OrderCreateResource | JsonResponse
    {
        try {
            $order = $this->completeOrderSubmissionService->complete($order);
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
