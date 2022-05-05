<?php

namespace App\Http\Controllers\API\V2\Customer\Order;

use App\Exceptions\API\Customer\Order\OrderShippingMethodCannotBeChangedException;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\V2\Customer\Order\UpdateOrderShippingMethodRequest;
use App\Http\Resources\API\V2\Customer\Order\OrderResource;
use App\Models\Order;
use App\Services\Order\V2\OrderService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class UpdateOrderShippingMethodController extends Controller
{
    /**
     * @throws Throwable
     */
    public function __invoke(
        UpdateOrderShippingMethodRequest $request,
        Order $order,
        OrderService $orderService
    ): OrderResource|JsonResponse {
        throw_if($order->isPaid(), OrderShippingMethodCannotBeChangedException::class);

        try {
            DB::beginTransaction();

            $orderService->processChangeInShippingMethod($order, $request->validated());

            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();

            return new JsonResponse([
                'message' => $e->getMessage(),
            ], Response::HTTP_BAD_REQUEST);
        }

        return new OrderResource($order);
    }
}