<?php

namespace App\Http\Requests\API\V2\Customer\Order;

use App\Models\Order;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class CreditAndDiscountRequest extends FormRequest
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

            if (! $order->shippingAddress) {
                $validator->errors()->add('shipping_address', 'Please enter a shipping address.');
            }
        });
    }

    public function rules(): array
    {
        return [
            'customer_address' => 'required|array',
            'customer_address.id' => 'nullable|integer|exists:customer_addresses,id',
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
            'payment_by_wallet' => [
                Rule::requiredIf(empty($this->payment_method)),
                'numeric',
            ],
            'coupon.code' => 'sometimes|exists:coupons,code',
        ];
    }
}
