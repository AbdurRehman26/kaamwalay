<?php

namespace App\Http\Controllers\API\Customer\Order;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\Customer\Order\StoreOrderRequest;
use App\Http\Resources\API\Customer\Order\OrderCollection;
use App\Http\Resources\API\Customer\Order\OrderCreateResource;
use App\Http\Resources\API\Customer\Order\OrderResource;
use App\Models\Order;
use App\Services\Order\CreateOrderService;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Order::class, 'order');
    }

    public function index(): OrderCollection
    {
        return new OrderCollection(Order::forUser(auth()->user())->paginate());
    }

    public function store(StoreOrderRequest $request): OrderCreateResource
    {
        $order = CreateOrderService::create($request->validated());

        return new OrderCreateResource($order);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Order  $order
     * @return OrderResource
     */
    public function show(Order $order)
    {
        return new OrderResource(Order::findOrFail($order['id']));
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
