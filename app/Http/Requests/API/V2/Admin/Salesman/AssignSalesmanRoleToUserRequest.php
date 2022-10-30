<?php

namespace App\Http\Requests\API\V2\Admin\Salesman;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AssignSalesmanRoleToUserRequest extends FormRequest
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
            'phone' => ['nullable', 'string'],
            'profile_image' => ['string', 'nullable'],
            'is_active' => ['required', Rule::in(false, true)],
            'commission_type' => ['required', Rule::in(0, 1)],
            'commission_value' => ['required', 'numeric', 'min:1']
        ];
    }
}
