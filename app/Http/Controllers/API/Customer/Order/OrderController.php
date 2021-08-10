<?php

namespace App\Http\Controllers\API\Customer\Order;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\Customer\Order\StoreOrderRequest;
use App\Http\Resources\API\Customer\Order\OrderShowResource;
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

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    public function store(StoreOrderRequest $request): OrderResource
    {
        $order = CreateOrderService::create($request->validated());

        return new OrderResource($order);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Order  $order
     * @return OrderShowResource
     */
    public function show(Order $order)
    {
        return new OrderShowResource(Order::findOrFail($order['id']));
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
