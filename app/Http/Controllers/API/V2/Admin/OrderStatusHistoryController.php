<?php

namespace App\Http\Controllers\API\V2\Admin;

use App\Exceptions\API\Admin\OrderStatusHistoryWasAlreadyAssigned;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\V2\Admin\Order\AssignOrderStatusHistoryRequest;
use App\Http\Resources\API\V2\Admin\Order\OrderStatusHistoryCollection;
use App\Http\Resources\API\V2\Admin\Order\OrderStatusHistoryResource;
use App\Models\Order;
use App\Services\Admin\V2\OrderStatusHistoryService;
use Throwable;

class OrderStatusHistoryController extends Controller
{
    public function __construct(protected OrderStatusHistoryService $orderStatusHistoryService)
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
