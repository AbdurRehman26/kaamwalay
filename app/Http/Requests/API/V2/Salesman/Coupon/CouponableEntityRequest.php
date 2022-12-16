<?php

namespace App\Http\Requests\API\V2\Salesman\Coupon;

use Illuminate\Foundation\Http\FormRequest;

class CouponableEntityRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return $this->user()->isSalesman();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'coupon_applicable_id' => ['required', 'exists:coupon_applicables,id'],
        ];
    }
}
