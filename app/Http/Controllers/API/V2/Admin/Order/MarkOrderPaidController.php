<?php

namespace App\Http\Controllers\API\V2\Admin\Order;

use App\Exceptions\API\Admin\Order\OrderIsAlreadyPaidException;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\V2\Admin\Order\MarkOrderPaidRequest;
use App\Http\Resources\API\V2\Admin\Order\OrderResource;
use App\Models\Order;
use App\Services\Admin\V2\OrderService;
use App\Services\Payment\V2\PaymentService;
use Exception;
use Throwable;

class MarkOrderPaidController extends Controller
{
    public function __construct(protected PaymentService $paymentService, protected OrderService $orderService)
    {
    }

    /**
     * @throws Throwable
     */
    public function __invoke(MarkOrderPaidRequest $request, Order $order): OrderResource
    {
        throw_if($order->isPaid(), OrderIsAlreadyPaidException::class);

        try {
            $this->orderService->createManualPayment($order, $request->user());

            $this->paymentService->charge($order->refresh(), []);
        } catch (Exception $e) {
            logger()->error('Error occurred while marking order as PAID.');
            logger()->error($e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            throw $e;
        }

        return new OrderResource($order);
    }
}
