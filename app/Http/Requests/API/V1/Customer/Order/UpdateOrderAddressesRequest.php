<?php

namespace App\Http\Requests\API\V1\Customer\Order;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOrderAddressesRequest extends FormRequest
{
    public function authorize()
    {
        /** @var Order $order */
        $order = $this->route('order');

        return $order->isPayable();
    }

    public function rules(): array
    {
        return [
            'payment_plan' => 'required|array',
            'payment_plan.id' => 'required|integer|exists:payment_plans,id',
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
            'shipping_method' => 'required|array',
            'shipping_method.id' => 'required|integer|exists:shipping_methods,id',
            'items' => 'required|array',
            'items.*.card_product' => 'required|array',
            'items.*.card_product.id' => 'required|integer|exists:card_products,id',
            'items.*.quantity' => 'required|integer',
            'items.*.declared_value_per_unit' => 'required|integer',
        ];
    }
}
