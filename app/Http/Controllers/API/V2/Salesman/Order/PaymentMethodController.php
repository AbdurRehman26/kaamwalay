<?php

namespace App\Http\Controllers\API\V2\Salesman\Order;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\V2\Salesman\Order\PaymentMethod\PaymentMethodCollection;
use App\Http\Resources\API\V2\Salesman\Order\PaymentMethod\PaymentMethodResource;
use App\Models\PaymentMethod;
use App\Services\Salesman\V2\PaymentMethodService;

class PaymentMethodController extends Controller
{
    public function __construct(protected PaymentMethodService $paymentMethodService)
    {
    }

    public function index(): PaymentMethodCollection
    {
        $paymentMethods = $this->paymentMethodService->getPaymentMethods();

        return new PaymentMethodCollection($paymentMethods);
    }

    public function show(PaymentMethod $paymentMethod): PaymentMethodResource
    {
        return new PaymentMethodResource($paymentMethod);
    }
}
