<?php

namespace App\Http\Controllers\API\Admin\Order;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\Admin\Order\UpdateNotesRequest;
use App\Http\Resources\API\Admin\Order\OrderListCollection;
use App\Http\Resources\API\Admin\Order\OrderResource;
use App\Models\Order;
use App\Services\Admin\Order\ManageOrderService;
use App\Services\Admin\OrderService;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function __construct(
        private OrderService $ordersService
    ) {
    }

    public function index(): OrderListCollection
    {
        $orders = $this->ordersService->getOrders();

        return new OrderListCollection($orders);
    }

    public function show(int $orderId): OrderResource
    {
        $order = $this->ordersService->getOrder($orderId);

        return new OrderResource($order);
    }

    public function updateNotes(UpdateNotesRequest $request, Order $order, ManageOrderService $manageOrderService): OrderResource
    {
        return new OrderResource($manageOrderService->updateNotes($order, $request->notes));
    }

    public function completeReview(Request $request, Order $order, ManageOrderService $manageOrderService): OrderResource
    {
        $this->authorize('review', $order);

        return new OrderResource($manageOrderService->confirmReview($order, $request->user()));
    }
}
