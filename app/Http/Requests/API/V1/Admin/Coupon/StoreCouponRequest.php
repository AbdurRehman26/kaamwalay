<?php

namespace App\Http\Requests\API\V1\Admin\Coupon;

use App\Models\CouponApplicable;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Arr;
use Illuminate\Validation\Rule;

class StoreCouponRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->isAdmin();
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // The design does not have a date picker when is_permanent is selected
        if ($this->get('is_permanent')) {
            $this->merge([
                'available_from' => now()->startOfDay()->toDateString(),
            ]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'code' => ['required'],
            'description' => ['required', 'max:250'],
            'type' => ['required', 'in:fixed,percentage,flat'],
            'discount_value' => ['required', 'numeric', 'min:1'],
            'coupon_applicable_id' => ['required', 'exists:coupon_applicables,id'],
            'available_from' => [
                'required',
                'date_format:Y-m-d',
                'after_or_equal:today',
            ],
            'is_permanent' => ['required', 'filled'],
            'available_till' => [
                Rule::requiredIf(! boolval($this->input('is_permanent'))),
                'nullable',
                'date_format:Y-m-d',
                'after_or_equal:available_from',
            ],
            'couponables' => [
                Rule::requiredIf(in_array($this->input('coupon_applicable_id'), CouponApplicable::COUPON_APPLICABLE_WITH_ENTITIES)),
                'array',
            ],
            'couponables.*' => [
                Rule::when(
                    Arr::has(
                        CouponApplicable::COUPON_APPLICABLE_WITH_ENTITIES,
                        $this->input('coupon_applicable_id')
                    ),
                    Rule::exists(CouponApplicable::ENTITIES_MAPPING[$this->input('coupon_applicable_id')] ?? null, 'id')
                ),
            ],
            'usage_allowed_per_user' => [
                'present',
                Rule::in([null, 1]),
            ],
        ];
    }
}
