<?php

namespace App\Http\Requests\API\V1\Admin\Coupon;

use Illuminate\Foundation\Http\FormRequest;

class CouponableEntityRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->isAdmin();
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'coupon_applicable_id' => ['required', 'exists:coupon_applicables,id'],
        ];
    }
}
