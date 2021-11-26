<?php

namespace App\Http\Requests\API\Customer;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCustomerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'first_name' => 'string',
            'last_name' => 'string',
            'username' => 'unique:users,username',
            'customer_number' => 'unique:users,customer_number',
        ];
    }
}
