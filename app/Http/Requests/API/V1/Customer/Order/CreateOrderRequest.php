<?php

namespace App\Http\Requests\API\V1\Customer\Order;

use Illuminate\Foundation\Http\FormRequest;

class CreateOrderRequest extends FormRequest
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
