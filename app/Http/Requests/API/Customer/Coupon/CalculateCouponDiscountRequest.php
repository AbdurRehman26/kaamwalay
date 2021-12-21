<?php

namespace App\Http\Requests\API\Customer\Coupon;

use Illuminate\Foundation\Http\FormRequest;

class CalculateCouponDiscountRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'coupon.code' => 'required|exists:coupons,code',
            'payment_plan' => 'required|array',
            'payment_plan.id' => 'required|integer|exists:payment_plans,id',
            'items' => 'required|array',
            'items.*.card_product' => 'required|array',
            'items.*.card_product.id' => 'required|integer',
            'items.*.quantity' => 'required|integer',
            'items.*.declared_value_per_unit' => 'required|integer',
            'shipping_method' => 'required|array',
            'shipping_method.id' => 'required|integer|exists:shipping_methods,id',
            'payment_method' => 'required|array',
            'payment_method.id' => 'required|integer|exists:payment_methods,id',
        ];
    }
}
