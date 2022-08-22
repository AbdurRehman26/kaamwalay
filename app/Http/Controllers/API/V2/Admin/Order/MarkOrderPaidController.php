<?php

namespace App\Http\Controllers\API\V2\Admin\Order;

use App\Exceptions\API\Admin\Order\OrderCanNotBeMarkedAsPaid;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\V2\Admin\Order\MarkOrderPaidRequest;
use App\Http\Resources\API\V2\Admin\Order\OrderResource;
use App\Models\Order;
use App\Models\PaymentMethod;
use App\Services\Payment\V2\PaymentService;

class MarkOrderPaidController extends Controller
{
    public function __construct(protected PaymentService $paymentService)
    {
    }

    public function __invoke(MarkOrderPaidRequest $request, Order $order): OrderResource
    {
        throw_if($order->isPaid(), OrderCanNotBeMarkedAsPaid::class);

        $order->orderPayments()->create([
            'payment_method_id' => PaymentMethod::whereCode('manual')->value('id'),
            'user_id' => $request->user()->id,
        ]);

        $this->paymentService->charge($order, []);

        return new OrderResource($order);
    }
}
