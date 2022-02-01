<?php

namespace App\Http\Requests\API\V1\Customer\Order;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOrderAddressesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'customer_address' => 'required|array',
            'customer_address.id' => 'nullable|integer|exists:customer_addresses,id',
            'shipping_address' => 'required|array',
            'shipping_address.first_name' => 'required|string',
            'shipping_address.last_name' => 'required|string',
            'shipping_address.address' => 'required|string',
            'shipping_address.city' => 'required|string',
            'shipping_address.state' => 'required|string|max:2',
            'shipping_address.zip' => 'required|string',
            'shipping_address.phone' => 'required|string',
            'shipping_address.flat' => 'nullable|string',
            'shipping_address.save_for_later' => 'required|boolean',
            'billing_address' => 'required|array',
            'billing_address.first_name' => 'required|string',
            'billing_address.last_name' => 'required|string',
            'billing_address.address' => 'required|string',
            'billing_address.city' => 'required|string',
            'billing_address.state' => 'required|string|max:2',
            'billing_address.zip' => 'required|string',
            'billing_address.phone' => 'required|string',
            'billing_address.flat' => 'nullable|string',
            'billing_address.same_as_shipping' => 'required|boolean',
            'shipping_method' => 'required|array',
            'shipping_method.id' => 'required|integer|exists:shipping_methods,id',
        ];
    }
}
