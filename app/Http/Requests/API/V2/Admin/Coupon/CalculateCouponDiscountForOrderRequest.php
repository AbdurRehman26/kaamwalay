<?php

namespace App\Http\Requests\API\V2\Admin\Coupon;

use Illuminate\Foundation\Http\FormRequest;

class CalculateCouponDiscountForOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'coupon.code' => ['required', 'exists:coupons,code'],
        ];
    }
}
