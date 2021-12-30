<?php

namespace App\Http\Requests\API\V1\Customer;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCustomerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'first_name' => ['sometimes', 'required', 'string', 'max: 255'],
            'last_name' => ['sometimes', 'required', 'string', 'max: 255'],
            'username' => [
                'sometimes',
                'required',
                'string',
                Rule::unique('users')->ignore(auth()->user()->id),
                'max:50',
            ],
            'profile_image' => ['string', 'nullable'],
            'phone' => ['string', 'nullable'],
        ];
    }
}
