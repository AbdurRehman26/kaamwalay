<?php

namespace App\Http\Requests\API\V3\Salesman\Order;

use Illuminate\Foundation\Http\FormRequest;

class UpdateShippingAddressRequest extends FormRequest
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
            'address' => ['required', 'string'],
            'address_2' => ['nullable', 'string'],
            'city' => ['required', 'string'],
            'state' => ['required', 'string'],
            'zip' => ['required', 'string'],
            'phone' => ['nullable', 'string'],
            'flat' => ['nullable', 'string'],
            'country_code' => ['sometimes', 'exists:countries,code'],
        ];
    }
}
