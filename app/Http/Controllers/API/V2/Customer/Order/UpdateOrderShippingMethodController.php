<?php

namespace App\Http\Controllers\API\V2\Customer\Order;

use App\Exceptions\API\Customer\Order\OrderShippingMethodCannotBeChangedException;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\V2\Customer\Order\UpdateOrderShippingMethodRequest;
use App\Http\Resources\API\V2\Customer\Order\OrderResource;
use App\Models\CustomerAddress;
use App\Models\Order;
use App\Models\OrderAddress;
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

            if ($request->filled('customer_address_id')) {
                $customerAddress = CustomerAddress::find($request->input('customer_address_id'));
                OrderAddress::create($customerAddress->toArray());
                $order->shippingAddress()->associate($customerAddress);
            }
            $orderService->changeShippingMethod($order, $request->input('shipping_method_id'));

            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();

            return new JsonResponse([
                'message' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return new OrderResource($order);
    }
}
