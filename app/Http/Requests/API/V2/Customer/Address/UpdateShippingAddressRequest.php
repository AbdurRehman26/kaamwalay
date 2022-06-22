<?php

namespace App\Http\Requests\API\V2\Customer\Address;

use Illuminate\Foundation\Http\FormRequest;

class UpdateShippingAddressRequest extends FormRequest
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
            'shipping_address' => ['required', 'array'],
            'shipping_address.country_id' =>  ['required', 'integer', 'exists:countries,id'],
            'shipping_address.first_name' => ['required', 'string'],
            'shipping_address.last_name' => ['required', 'string'],
            'shipping_address.address' => ['required', 'string'],
            'shipping_address.address_2' => ['nullable', 'string'],
            'shipping_address.city' => ['required', 'string'],
            'shipping_address.state' => ['required', 'string',],
            'shipping_address.zip' => ['required', 'string'],
            'shipping_address.phone' => ['required', 'string'],
        ];
    }
}
