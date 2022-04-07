<?php

namespace App\Http\Requests\API\V2\Customer\Addresses;

use Illuminate\Foundation\Http\FormRequest;

class StoreCustomerAddressRequest extends FormRequest
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
            'first_name' => ['required', 'string'],
            'last_name' => ['required', 'string'],
            'address' => ['required', 'string'],
            'city' => ['required', 'string'],
            'state' => ['required', 'string', 'max:2'],
            'zip' => ['required', 'string'],
            'phone' => ['required', 'string'],
            'flat' => ['nullable', 'string'],
        ];
    }
}
