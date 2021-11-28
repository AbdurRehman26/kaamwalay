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
            'first_name' => ['string', 'max: 255'],
            'last_name' => ['string', 'max: 255'],
            'email' => ['email', 'unique:users'],
            'phone' => ['string'],
            'password' => [
                Password::min(8)
                    ->letters()
                    ->mixedCase()
                    ->numbers(),
               ],
            'username' => ['string', 'unique:users', 'max:50'],
            'customer_number' => ['string', 'unique:users'],
        ];
    }
}
