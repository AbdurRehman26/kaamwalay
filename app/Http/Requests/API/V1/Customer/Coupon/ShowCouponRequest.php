<?php

namespace App\Http\Requests\API\V1\Customer\Coupon;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ShowCouponRequest extends FormRequest
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
            'couponables_type' => [ 'sometimes', Rule::in(['service_level'])],
            'couponables_id' => 'sometimes',
        ];
    }
}
