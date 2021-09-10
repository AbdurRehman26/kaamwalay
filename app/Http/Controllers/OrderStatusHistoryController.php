<?php

namespace App\Http\Controllers;

use App\Exceptions\API\Admin\OrderStatusHistoryWasAlreadyAssigned;
use App\Http\Requests\API\Admin\Order\AssignOrderStatusHistoryRequest;
use App\Http\Resources\API\Admin\Order\OrderStatusHistoryCollection;
use App\Http\Resources\API\Admin\Order\OrderStatusHistoryResource;
use App\Models\Order;
use App\Models\OrderStatus;
use App\Services\Admin\OrderStatusHistoryService;
use Illuminate\Auth\Access\AuthorizationException;
use Throwable;

class OrderStatusHistoryController extends Controller
{
    public function __construct(private OrderStatusHistoryService $orderStatusHistoryService)
    {
    }

    public function index(Order $order): OrderStatusHistoryCollection
    {
        return new OrderStatusHistoryCollection(
            $this->orderStatusHistoryService->getAllByOrderId($order)
        );
    }

    /**
     * @throws OrderStatusHistoryWasAlreadyAssigned|Throwable
     */
    public function store(Order $order, AssignOrderStatusHistoryRequest $request): OrderStatusHistoryResource
    {
        return new OrderStatusHistoryResource(
            $this->orderStatusHistoryService->addStatusToOrder($request->order_status_id, $order)
        );
    }
}
