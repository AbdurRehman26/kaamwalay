<?php

namespace App\Http\Requests\API\Customer;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

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
            'email_subscription' => ['sometimes', 'required', 'boolean'],
            'current_password' => ['sometimes', 'required', 'password'],
            'password' => [
                'sometimes',
                'required',
                Password::min(8)
                    ->letters()
                    ->mixedCase()
                    ->numbers(),
               'confirmed'
                ],
            'username' => [
                'sometimes',
                'required',
                'string',
                Rule::unique('users')->ignore(auth()->user()->id),
                'max:50'],
            'profile_image' => ['string', 'nullable'],
            'phone' => ['string', 'nullable'],
        ];
    }
}
