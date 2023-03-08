<?php

namespace App\Http\Requests\API\V3\Admin\Customer;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCustomerDetailsRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'first_name' => ['required', 'string'],
            'last_name' => ['required', 'string'],
            'phone' => ['nullable', 'string'],
        ];
    }
}
