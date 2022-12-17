<?php

namespace App\Http\Requests\API\V2\Salesman\Coupon;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ChangeCouponStatusRequest extends FormRequest
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
            'status' => [
                'required',
                Rule::when(fn ($value) => is_numeric($value->status), 'exists:coupon_statuses,id'),
                Rule::when(fn ($value) => ! is_numeric($value->status), 'exists:coupon_statuses,code'),
            ],
        ];
    }
}
