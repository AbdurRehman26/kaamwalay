<?php

namespace App\Http\Controllers\API\V1\Customer\Order;

use App\Exceptions\API\Customer\Order\CustomerShipmentNotUpdated;
use App\Exceptions\API\Customer\Order\OrderCanNotCanceled;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\V1\Customer\Order\CalculateOrderCollectorCoinPriceRequest;
use App\Http\Requests\API\V1\Customer\Order\StoreOrderRequest;
use App\Http\Requests\API\V2\Customer\Order\UpdateCustomerShipmentRequest;
use App\Http\Resources\API\V1\Customer\Order\OrderCollection;
use App\Http\Resources\API\V1\Customer\Order\OrderCreateResource;
use App\Http\Resources\API\V1\Customer\Order\OrderCustomerShipmentResource;
use App\Http\Resources\API\V1\Customer\Order\OrderResource;
use App\Models\Order;
use App\Models\OrderStatus;
use App\Services\Order\OrderService;
use App\Services\Order\Shipping\CustomerShipmentService;
use App\Services\Order\V1\CreateOrderService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class OrderController extends Controller
{
    public function __construct(
        protected OrderService $orderService,
        protected CreateOrderService $createOrderService
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
}
