<?php

namespace App\Http\Requests\API\V2\Admin\Coupon;

use Illuminate\Foundation\Http\FormRequest;

class CalculateCouponDiscountRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array
    {
        return [
            'coupon.code' => ['required', 'exists:coupons,code'],
            'payment_plan' => ['required', 'array'],
            'payment_plan.id' => ['required', 'integer', 'exists:payment_plans,id'],
            'items' => ['required', 'array'],
            'items.*.card_product' => ['required', 'array'],
            'items.*.card_product.id' => ['required', 'integer'],
            'items.*.quantity' => ['required', 'integer'],
            'items.*.declared_value_per_unit' => ['required', 'integer'],
        ];
    }
}
