<?php

namespace App\Http\Controllers\API\Admin\Order;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\Admin\Order\OrderListCollection;
use App\Http\Resources\API\Admin\Order\OrderResource;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\QueryBuilder;

class OrderController extends Controller
{
    public function index(): OrderListCollection
    {
        $orders = QueryBuilder::for(Order::class)
            ->allowedFilters(['order_number', 'id', 'order_status_id'])
            ->allowedSorts(['order_status_id', 'grand_total'])
            ->placed()
            ->latest()
            ->paginate(request('per_page', 15));

        return new OrderListCollection($orders);
    }

    public function show(Order $order): OrderResource
    {
        return new OrderResource($order);
    }
}
