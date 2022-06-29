<?php

namespace App\Http\Requests\API\V2\Customer\Coupon;

use Illuminate\Foundation\Http\FormRequest;

class CalculateCouponDiscountForOrderRequest extends FormRequest
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
            'coupon.code' => ['required', 'exists:coupons,code'],
        ];
    }
}
