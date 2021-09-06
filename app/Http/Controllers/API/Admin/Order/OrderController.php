<?php

namespace App\Http\Controllers\API\Admin\Order;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\Admin\Order\OrderListCollection;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(): OrderListCollection
    {
        $orders = Order::all();

        return new OrderListCollection($orders);
    }
}
