<?php

namespace App\Http\Requests\API\V2\Salesman\Order;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBillingAddressRequest extends FormRequest
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
            'city' => ['required', 'string'],
            'state' => ['required', 'string', 'max:2'],
            'zip' => ['required', 'string'],
            'phone' => ['required', 'string'],
            'flat' => ['nullable', 'string'],
        ];
    }
}
