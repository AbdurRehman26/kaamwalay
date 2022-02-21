<?php

namespace App\Http\Requests\API\V2\Customer\Order;

use App\Http\Requests\API\V1\Customer\Order\StoreOrderRequest as V1StoreOrderRequest;

class StoreOrderRequest extends V1StoreOrderRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'payment_plan' => 'required|array',
            'payment_plan.id' => 'required|integer|exists:payment_plans,id',
        ];
    }
}
