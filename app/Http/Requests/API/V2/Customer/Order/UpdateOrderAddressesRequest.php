<?php

namespace App\Http\Requests\API\V2\Customer\Order;

use App\Models\Order;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class UpdateOrderAddressesRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var Order $order */
        $order = $this->route('order');

        return $order->isPayable();
    }

    public function withValidator(Validator $validator): void
    {
        /** @var Order $order */
        $order = $this->route('order');

        $validator->after(function ($validator) use ($order) {
            if (! $order->paymentPlan) {
                $validator->errors()->add('payment_plan', 'Please select a valid payment plan.');
            }
            if (! $order->orderItems()->count()) {
                $validator->errors()->add('items', 'Please select at least one card to proceed.');
            }
        });
    }

    public function rules(): array
    {
        $customerAddressExists = ! empty($this->{'customer_address.id'});
        $shippingAddressIdExists = ! empty($this->{'shipping_address.id'});

        $shippingAddressIsRequired = ! $customerAddressExists && ! $shippingAddressIdExists;
        $isNullableOrString = $shippingAddressIsRequired ? 'string' : 'nullable';

        return [
            'customer_address' => ['required', 'array'],
            'customer_address.id' => ['nullable', 'integer', 'exists:customer_addresses,id'],
            'shipping_address' => [Rule::requiredIf($shippingAddressIsRequired || $shippingAddressIdExists), 'array'],
            'shipping_address.first_name' => [Rule::requiredIf($shippingAddressIsRequired), $isNullableOrString],
            'shipping_address.last_name' => [Rule::requiredIf($shippingAddressIsRequired), $isNullableOrString],
            'shipping_address.address' => [Rule::requiredIf($shippingAddressIsRequired), $isNullableOrString],
            'shipping_address.city' => [Rule::requiredIf($shippingAddressIsRequired), $isNullableOrString],
            'shipping_address.state' => [Rule::requiredIf($shippingAddressIsRequired), $isNullableOrString, 'max:2'],
            'shipping_address.zip' => [Rule::requiredIf($shippingAddressIsRequired), $isNullableOrString],
            'shipping_address.phone' => [Rule::requiredIf($shippingAddressIsRequired), $isNullableOrString],
            'shipping_address.flat' => [Rule::requiredIf($shippingAddressIsRequired), 'nullable', 'string'],
            'shipping_address.save_for_later' => [Rule::requiredIf($shippingAddressIsRequired), 'boolean'],
            'shipping_address.id' => [Rule::requiredIf($shippingAddressIdExists), 'integer', 'exists:orders,shipping_order_address_id'],
            'shipping_method' => 'required|array',
            'shipping_method.id' => 'required|integer|exists:shipping_methods,id',
        ];
    }
}
