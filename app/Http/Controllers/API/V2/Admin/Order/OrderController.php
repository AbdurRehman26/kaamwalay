<?php

namespace App\Http\Controllers\API\V2\Admin\Order;

use App\Exceptions\API\Admin\Order\OrderCanNotBeMarkedAsShipped;
use App\Http\Controllers\API\V1\Admin\Order\OrderController as V1OrderController;
use App\Http\Requests\API\V2\Admin\Order\UpdateShipmentRequest;
use App\Http\Resources\API\V2\Admin\Order\OrderResource;
use App\Models\Order;
use App\Services\Admin\V2\OrderService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class OrderController extends V1OrderController
{
    /**
     * @throws Throwable
     */
    public function processShipment(UpdateShipmentRequest $request, Order $order): OrderResource | JsonResponse
    {
        throw_unless($order->isPaid(), OrderCanNotBeMarkedAsShipped::class);

        try {
            DB::beginTransaction();
            /** @var OrderService $orderService */
            $orderService = resolve(OrderService::class);

            $orderService->shipOrder(
                $order,
                $request->only('shipping_provider', 'tracking_number')
            );

            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            
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
