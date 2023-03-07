<?php

namespace App\Http\Requests\API\V2\Admin\Coupon;

use App\Http\Requests\API\V1\Admin\Coupon\StoreCouponRequest as V1StoreCouponRequest;
use Illuminate\Validation\Rule;

class StoreCouponRequest extends V1StoreCouponRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array
    {
        $rules = parent::rules();

        return array_merge($rules, [
            'has_minimum_cards_threshold' => ['sometimes', 'boolean'],
            'min_threshold_value' => [
                'required_if:has_minimum_cards_threshold,true',
                'numeric',
                Rule::when((bool) $this->input('has_minimum_cards_threshold') === true, ['min:2']),
            ],
            'type' => ['required', 'in:fixed,percentage,flat,free_cards'],
        ]);
    }
}
