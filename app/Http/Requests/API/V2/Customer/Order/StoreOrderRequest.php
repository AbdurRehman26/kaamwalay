<?php

namespace App\Http\Requests\API\V2\Customer\Order;

use App\Http\Requests\API\V1\Customer\Order\StoreOrderRequest as V1StoreOrderRequest;
use App\Models\ShippingMethod;
use Illuminate\Support\Arr;

class StoreOrderRequest extends V1StoreOrderRequest
{
    public function rules(): array
    {
        $rules = [
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
            'shipping_address.country_id' => ['required', 'integer'],
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
            'billing_address.country_id' => ['required', 'integer'],
            'shipping_method' => ['required', 'array'],
            'shipping_method.id' => ['required', 'integer', 'exists:shipping_methods,id'],
            'payment_by_wallet' => [
                'nullable',
                'numeric',
            ],
            'coupon.code' => ['sometimes', 'exists:coupons,code'],
        ];

        if ($this->addressIsNotRequired()) {
            $rules = Arr::except($rules, [
                'customer_address',
                'customer_address.id',
                'shipping_address',
                'shipping_address.first_name',
                'shipping_address.last_name',
                'shipping_address.address',
                'shipping_address.city',
                'shipping_address.state',
                'shipping_address.zip',
                'shipping_address.phone',
                'shipping_address.flat',
                'shipping_address.save_for_later',
                'billing_address',
                'billing_address.first_name',
                'billing_address.last_name',
                'billing_address.address',
                'billing_address.city',
                'billing_address.state',
                'billing_address.zip',
                'billing_address.phone',
                'billing_address.flat',
                'billing_address.same_as_shipping',
            ]);
        }

        return $rules;
    }

    protected function addressIsNotRequired(): bool
    {
        if ($this->has('shipping_method')) {
            return ShippingMethod::where(
                'id',
                $this->input('shipping_method')['id']
            )->value('code') === ShippingMethod::VAULT_STORAGE;
        }

        return false;
    }
}
