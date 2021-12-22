<?php

namespace App\Http\Requests\API\Customer\Coupon;

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
            'couponable_type' => ['required', Rule::in(['service_level'])],
            'couponable_id' => 'required',
        ];
    }
}
