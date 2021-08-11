<?php

namespace App\Http\Controllers\API\Customer\Order;

use App\Exceptions\API\Customer\Order\OrderNotPlaced;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\Customer\Order\StoreOrderRequest;
use App\Http\Resources\API\Customer\Order\OrderCollection;
use App\Http\Resources\API\Customer\Order\OrderCreateResource;
use App\Http\Resources\API\Customer\Order\OrderResource;
use App\Models\Order;
use App\Services\Order\CreateOrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class OrderController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Order::class, 'order');
    }

    public function index(): OrderCollection
    {
        return new OrderCollection(
            Order::forUser(auth()->user())
                ->latest()
                ->paginate()
        );
    }

    public function store(StoreOrderRequest $request, CreateOrderService $createOrderService): OrderCreateResource | JsonResponse
    {
        try {
            $order = $createOrderService->create($request->validated());
        } catch (OrderNotPlaced $e) {
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

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Order  $order
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Order $order)
    {
        //
    }
}