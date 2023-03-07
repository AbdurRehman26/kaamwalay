<?php

namespace App\Http\Requests\API\V1\Customer\Coupon;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ShowCouponRequest extends FormRequest
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
            'couponables_type' => [ 'sometimes', Rule::in(['service_level'])],
            'couponables_id' => 'sometimes',
        ];
    }
}
