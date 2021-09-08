<?php

namespace App\Http\Controllers\API\Admin\Order;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\Admin\Order\OrderListCollection;
use App\Http\Resources\API\Admin\Order\OrderResource;
use App\Models\Order;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;
use App\Services\Admin\Order\ManageOrderService;

class OrderController extends Controller
{
    public function index(): OrderListCollection
    {
        $orders = QueryBuilder::for(Order::class)
            ->allowedFilters([
                AllowedFilter::exact('order_id', 'id'),
                AllowedFilter::scope('status_code'),
                AllowedFilter::scope('customer_name'),
                AllowedFilter::scope('customer_id'),
            ])
            ->allowedSorts(['grand_total'])
            ->defaultSort('-created_at')
            ->paginate(request('per_page', 15));

        return new OrderListCollection($orders);
    }

    public function show(Order $order): OrderResource
    {
        return new OrderResource($order);
    }

    public function completeReview(Request $request, Order $order, ManageOrderService $manageOrderService): OrderResource
    {
        $this->authorize('review', $order);

        return new OrderResource($manageOrderService->confirmReview($order, $request->user()));
    }

}
