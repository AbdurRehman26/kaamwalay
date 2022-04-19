<?php

namespace App\Http\Requests\API\V2\Customer\Order;

use App\Models\Order;
use App\Models\ShippingMethod;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateOrderShippingMethodRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        /** @var User $user */
        $user = $this->user();
        /** @var Order $order */
        $order = $this->route('order');

        return $user->is($order->user);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'shipping_method_id' => [
                'required',
                'exists:shipping_methods,id',
            ],
            'customer_address' => [Rule::requiredIf($this->isShippingAddressRequired()), 'array'],
            'customer_address.id' => ['nullable', 'integer', 'exists:customer_addresses,id'],
            'shipping_address' => [Rule::requiredIf($this->isShippingAddressRequired() && $this->hasNoCustomerAddress()), 'array'],
            'shipping_address.save_for_later' => [Rule::requiredIf($this->isShippingAddressRequired() && $this->hasNoCustomerAddress())],
            'shipping_address.first_name' => [Rule::requiredIf($this->isShippingAddressRequired() && $this->hasNoCustomerAddress()), 'string'],
            'shipping_address.last_name' => [Rule::requiredIf($this->isShippingAddressRequired() && $this->hasNoCustomerAddress()), 'string'],
            'shipping_address.address' => [Rule::requiredIf($this->isShippingAddressRequired() && $this->hasNoCustomerAddress()), 'string'],
            'shipping_address.city' => [Rule::requiredIf($this->isShippingAddressRequired() && $this->hasNoCustomerAddress()), 'string'],
            'shipping_address.state' => [Rule::requiredIf($this->isShippingAddressRequired() && $this->hasNoCustomerAddress()), 'string', 'max:2'],
            'shipping_address.zip' => [Rule::requiredIf($this->isShippingAddressRequired() && $this->hasNoCustomerAddress()), 'string'],
            'shipping_address.phone' => [Rule::requiredIf($this->isShippingAddressRequired() && $this->hasNoCustomerAddress()), 'string'],
            'shipping_address.flat' => ['nullable', 'string'],
        ];
    }

    protected function isShippingAddressRequired(): bool
    {
        return ShippingMethod::where(
            'id',
            $this->input('shipping_method_id')
        )->value('code') === ShippingMethod::INSURED_SHIPPING;
    }

    protected function hasNoCustomerAddress(): bool
    {
        return empty($this->input('customer_address')['id']);
    }
}
