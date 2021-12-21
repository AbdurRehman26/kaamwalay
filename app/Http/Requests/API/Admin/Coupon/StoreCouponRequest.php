<?php

namespace App\Http\Requests\API\Admin\Coupon;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCouponRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return $this->user()->isAdmin();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'code' => ['required'],
            'discount_type' => ['required', 'in:fixed,percentage'],
            'discount_value' => ['required', 'numeric'],
            'coupon_applicable_id' => ['required', 'exists:coupon_applicables'],
            'available_from' => ['required', 'date_format:Y-m-d H:i:s'],
            'is_permanent' => ['required', 'filled'],
            'available_till' => [Rule::requiredIf(boolval($this->get('is_permanent'))), 'date_format:Y-m-d H:i:s'],
        ];
    }
}
