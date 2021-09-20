<?php

namespace App\Http\Controllers\API\Admin\Order;

use App\Exceptions\API\Admin\Order\ShipmentNotUpdated;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\Admin\Order\UpdateShipmentRequest;
use App\Http\Resources\API\Admin\Order\OrderListCollection;
use App\Http\Resources\API\Admin\Order\OrderResource;
use App\Models\Order;
use App\Services\Admin\Order\ShipmentService;
use Illuminate\Http\JsonResponse;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;
use Symfony\Component\HttpFoundation\Response;

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

    public function updateShipment(UpdateShipmentRequest $request, Order $order, ShipmentService $shipmentService): OrderResource | JsonResponse
    {
        try {
            $order = $shipmentService->process($order, $request->shipping_provider, $request->tracking_number);
        } catch (ShipmentNotUpdated $e) {
            return new JsonResponse(
                [
                    'error' => $e->getMessage(),
                ],
                Response::HTTP_BAD_REQUEST
            );
        }

        return new OrderResource($order);
    }
}
