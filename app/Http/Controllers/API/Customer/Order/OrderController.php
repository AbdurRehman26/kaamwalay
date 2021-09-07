<?php

namespace App\Http\Controllers\API\Customer\Order;

use App\Exceptions\API\Customer\Order\CustomerShipmentNotUpdated;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\Customer\Order\StoreOrderRequest;
use App\Http\Requests\API\Customer\Order\UpdateCustomerShipmentRequest;
use App\Http\Requests\API\Customer\Order\AddExtraCardRequest;
use App\Http\Requests\API\Customer\Order\MarkItemsPendingRequest;
use App\Http\Resources\API\Customer\Order\OrderCollection;
use App\Http\Resources\API\Customer\Order\OrderCreateResource;
use App\Http\Resources\API\Customer\Order\OrderResource;
use App\Http\Resources\API\Customer\Order\OrderItem\OrderItemResource;
use App\Models\Order;
use App\Models\OrderItem;
use App\Services\Order\CreateOrderService;
use App\Services\Order\Shipping\CustomerShipmentService;
use Exception;
use Illuminate\Http\JsonResponse;
use Spatie\QueryBuilder\QueryBuilder;
use Symfony\Component\HttpFoundation\Response;
use App\Services\Order\ConfirmItemService;
use App\Services\Order\OrderItemsService;
use App\Services\Order\ManageOrderService;
use App\Http\Resources\API\Customer\Order\OrderItem\OrderItemCollection;

class OrderController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Order::class, 'order');
    }

    public function index(): OrderCollection
    {
        return new OrderCollection(
            QueryBuilder::for(Order::class)
                ->forUser(auth()->user())
                ->placed()
                ->latest()
                ->allowedFilters('order_number')
                ->paginate(request('per_page'))
        );
    }

    public function store(StoreOrderRequest $request, CreateOrderService $createOrderService): OrderCreateResource | JsonResponse
    {
        try {
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

    public function show(Order $order): OrderResource
    {
        return new OrderResource($order);
    }

    public function updateCustomerShipment(UpdateCustomerShipmentRequest $request, Order $order, CustomerShipmentService $customerShipmentService): OrderResource | JsonResponse
    {
        $this->authorize('view', $order);

        try {
            $order = $customerShipmentService->process($order, $request->shipping_provider, $request->tracking_number);
        } catch (CustomerShipmentNotUpdated $e) {
            return new JsonResponse(
                [
                    'error' => $e->getMessage(),
                ],
                Response::HTTP_BAD_REQUEST
            );
        }

        return new OrderResource($order);
    }

    public function completeReview(Request $request, Order $order, ManageOrderService $manageOrderService): OrderResource
    {
        return new OrderResource($manageOrderService->confirmReview($order, $request->user()));
    }

}
