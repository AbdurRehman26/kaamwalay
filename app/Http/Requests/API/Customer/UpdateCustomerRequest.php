<?php

namespace App\Http\Requests\API\Customer;

use Illuminate\Foundation\Http\FormRequest;
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
            'phone' => ['sometimes', 'string'],
            'email_subscription' => ['sometimes', 'boolean'],
            'password' => [
                'sometimes',
                'required',
                Password::min(8)
                    ->letters()
                    ->mixedCase()
                    ->numbers(),
               ],
            'username' => ['sometimes', 'required', 'string', 'unique:users', 'max:50'],
        ];
    }
}
