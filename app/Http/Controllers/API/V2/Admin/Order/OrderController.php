<?php

namespace App\Http\Controllers\API\V2\Admin\Order;

use App\Exceptions\API\Admin\Order\ShipmentNotUpdated;
use App\Http\Controllers\API\V1\Admin\Order\OrderController as V1OrderController;
use App\Http\Requests\API\V2\Admin\Order\UpdateShipmentRequest;
use App\Http\Resources\API\V2\Admin\Order\OrderResource;
use App\Models\Order;
use App\Services\Admin\V2\OrderService;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class OrderController extends V1OrderController
{
    public function processShipment(UpdateShipmentRequest $request, Order $order): OrderResource | JsonResponse
    {
        try {
            /** @var OrderService $orderService */
            $orderService = resolve(OrderService::class);

            $orderService->shipOrder(
                $order,
                $request->only('shipping_provider', 'tracking_number')
            );
        } catch (ShipmentNotUpdated $e) {
            return new JsonResponse(
                [
                    'error' => $e->getMessage(),
                ],
                Response::HTTP_BAD_REQUEST
            );
        }

        $order->refresh()->load('orderShipment');

        return new OrderResource($order);
    }
}
