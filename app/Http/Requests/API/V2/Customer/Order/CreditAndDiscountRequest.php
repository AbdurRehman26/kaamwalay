<?php

namespace App\Http\Requests\API\V2\Customer\Order;

use App\Models\Order;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreditAndDiscountRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var Order $order */
        $order = $this->route('order');

        return $order->isPayable();
    }

    public function rules(): array
    {
        return [
            'payment_by_wallet' => [
                Rule::requiredIf(empty($this->payment_method)),
                'numeric',
            ],
            'coupon.code' => 'sometimes|exists:coupons,code',
        ];
    }
}
