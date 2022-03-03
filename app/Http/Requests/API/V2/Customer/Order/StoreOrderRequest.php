<?php

namespace App\Http\Requests\API\V2\Customer\Order;

use App\Http\Requests\API\V1\Customer\Order\StoreOrderRequest as V1StoreOrderRequest;

class StoreOrderRequest extends V1StoreOrderRequest
{
    public function rules(): array
    {
        return [
            'payment_plan' => ['required', 'array'],
            'payment_plan.id' => ['required', 'integer', 'exists:payment_plans,id'],
            'items' => ['required', 'array'],
            'items.*.card_product' => ['required', 'array'],
            'items.*.card_product.id' => ['required', 'integer'],
            'items.*.quantity' => ['required', 'integer'],
            'items.*.declared_value_per_unit' => ['required', 'integer'],
            'customer_address' => ['required', 'array'],
            'customer_address.id' => ['nullable', 'integer', 'exists:customer_addresses,id'],
            'shipping_address' => ['required', 'array'],
            'shipping_address.first_name' => ['required', 'string'],
            'shipping_address.last_name' => ['required', 'string'],
            'shipping_address.address' => ['required', 'string'],
            'shipping_address.city' => ['required', 'string'],
            'shipping_address.state' => ['required', 'string', 'max:2'],
            'shipping_address.zip' => ['required', 'string'],
            'shipping_address.phone' => ['required', 'string'],
            'shipping_address.flat' => ['nullable', 'string'],
            'shipping_address.save_for_later' => ['required', 'boolean'],
            'billing_address' => ['required', 'array'],
            'billing_address.first_name' => ['required', 'string'],
            'billing_address.last_name' => ['required', 'string'],
            'billing_address.address' => ['required', 'string'],
            'billing_address.city' => ['required', 'string'],
            'billing_address.state' => ['required', 'string', 'max:2'],
            'billing_address.zip' => ['required', 'string'],
            'billing_address.phone' => ['required', 'string'],
            'billing_address.flat' => ['nullable', 'string'],
            'billing_address.same_as_shipping' => ['required', 'boolean'],
            'shipping_method' => ['required', 'array'],
            'shipping_method.id' => ['required', 'integer', 'exists:shipping_methods,id'],
            'coupon.code' => ['sometimes', 'exists:coupons,code'],
            'payment_by_wallet' => [
                'nullable',
                'numeric',
            ],
        ];
    }
}
