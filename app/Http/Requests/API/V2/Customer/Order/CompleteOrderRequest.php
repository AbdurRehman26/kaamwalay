<?php

namespace App\Http\Requests\API\V2\Customer\Order;

use App\Models\Order;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class CompleteOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var Order $order */
        $order = $this->route('order');

        return $order->isPayable();
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function ($validator) {

            if (!$this->route('order')->paymentPlan) {
                $validator->errors()->add('payment_plan', 'Please select a valid payment plan.');
            }

            if (!$this->route('order')->orderItems()->count()) {
                $validator->errors()->add('items', 'Please select at least one card to proceed.');
            }

            if (!$this->route('order')->shippingAddress) {
                $validator->errors()->add('shipping_address', 'Please enter a shipping address.');
            }

        });
    }

    public function rules(): array
    {
        return [
            'customer_address' => 'required|array',
            'customer_address.id' => 'nullable|integer|exists:customer_addresses,id',
            'shipping_method' => 'required|array',
            'shipping_method.id' => 'required|integer|exists:shipping_methods,id',
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
            'payment_method' => [
                Rule::requiredIf(empty($this->payment_by_wallet)),
                'nullable',
                'array',
            ],
            'payment_method.id' => [
                Rule::requiredIf(empty($this->payment_by_wallet)),
                'integer',
                'exists:payment_methods,id',
            ],
            'payment_by_wallet' => [
                Rule::requiredIf(empty($this->payment_method)),
                'numeric',
            ],
            'payment_provider_reference' => 'nullable|array',
            'payment_provider_reference.id' => 'nullable|string',
            'coupon.code' => 'sometimes|exists:coupons,code',
        ];
    }
}
