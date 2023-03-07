<?php

namespace App\Http\Requests\API\V2\Admin\Coupon;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class VerifyCouponRequest extends FormRequest
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
            'couponables_type' => [ 'sometimes', Rule::in(['service_level'])],
            'couponables_id' => 'sometimes',
        ];
    }
}
