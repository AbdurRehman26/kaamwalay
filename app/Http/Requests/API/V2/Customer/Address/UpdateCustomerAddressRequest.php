<?php

namespace App\Http\Requests\API\V2\Customer\Address;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCustomerAddressRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'customer_address' => ['required', 'array'],
            'customer_address.country_id' => ['required', 'integer', 'exists:countries,id'],
            'customer_address.first_name' => ['required', 'string'],
            'customer_address.last_name' => ['required', 'string'],
            'customer_address.address' => ['required', 'string'],
            'customer_address.address_2' => ['nullable', 'string'],
            'customer_address.city' => ['required', 'string'],
            'customer_address.state' => ['required', 'string',],
            'customer_address.zip' => ['required', 'string'],
            'customer_address.phone' => ['required', 'string'],
        ];
    }
}
