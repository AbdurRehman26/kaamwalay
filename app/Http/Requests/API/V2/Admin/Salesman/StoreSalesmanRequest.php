<?php

namespace App\Http\Requests\API\V2\Admin\Salesman;

use App\Enums\Salesman\CommissionTypeEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSalesmanRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'first_name' => ['required', 'string', 'max: 255'],
            'last_name' => ['nullable', 'string', 'max: 255'],
            'email' => ['required', 'email', 'unique:users'],
            'phone' => ['nullable', 'string'],
            'profile_image' => ['string', 'nullable'],
            'is_active' => ['required', 'boolean'],
            'commission_type' => ['required', Rule::in(CommissionTypeEnum::values())],
            'commission_value' => ['required', 'numeric', 'min:1'],
        ];
    }
}