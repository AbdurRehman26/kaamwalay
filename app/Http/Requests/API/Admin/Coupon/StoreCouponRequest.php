<?php

namespace App\Http\Requests\API\Admin\Coupon;

use App\Models\CouponApplicable;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Arr;
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
            'type' => ['required', 'in:fixed,percentage'],
            'discount_value' => ['required', 'numeric'],
            'coupon_applicable_id' => ['required', 'exists:coupon_applicables,id'],
            'available_from' => ['required', 'date_format:Y-m-d H:i:s'],
            'is_permanent' => ['required', 'filled'],
            'available_till' => [Rule::requiredIf(boolval($this->get('is_permanent'))), 'date_format:Y-m-d H:i:s'],
            'couponables' => [
                Rule::requiredIf(Arr::has(CouponApplicable::COUPON_APPLICABLE_WITH_ENTITIES, $this->get('coupon_applicable_id'))),
                'array',
            ],
            'couponables.*' => [
                Rule::when(
                    Arr::has(
                        CouponApplicable::COUPON_APPLICABLE_WITH_ENTITIES,
                        $this->get('coupon_applicable_id')
                    ),
                    Rule::exists(CouponApplicable::ENTITIES_MAPPING[$this->get('coupon_applicable_id')] ?? null, 'id')
                ),
            ],
        ];
    }
}
