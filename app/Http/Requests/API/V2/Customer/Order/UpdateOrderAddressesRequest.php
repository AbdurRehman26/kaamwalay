<?php

namespace App\Http\Requests\API\V2\Customer\Order;

use App\Models\Order;
use Illuminate\Foundation\Http\FormRequest;
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
            'shipping_method' => 'required|array',
            'shipping_method.id' => 'required|integer|exists:shipping_methods,id',
        ];
    }
}
