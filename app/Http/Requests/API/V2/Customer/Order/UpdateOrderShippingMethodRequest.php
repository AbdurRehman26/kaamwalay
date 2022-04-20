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
        $isAddressRequired = $this->isAddressRequired();
        $hasNoCustomerAddress = $this->hasNoCustomerAddress();

        return [
            'shipping_method_id' => [
                'required',
                'exists:shipping_methods,id',
            ],
            'customer_address' => [Rule::requiredIf($isAddressRequired), 'array'],
            'customer_address.id' => ['nullable', 'integer', 'exists:customer_addresses,id'],
            'shipping_address' => [Rule::requiredIf($isAddressRequired && $hasNoCustomerAddress), 'array'],
            'shipping_address.save_for_later' => [Rule::requiredIf($isAddressRequired && $hasNoCustomerAddress)],
            'shipping_address.first_name' => [Rule::requiredIf($isAddressRequired && $hasNoCustomerAddress), 'string'],
            'shipping_address.last_name' => [Rule::requiredIf($isAddressRequired && $hasNoCustomerAddress), 'string'],
            'shipping_address.address' => [Rule::requiredIf($isAddressRequired && $hasNoCustomerAddress), 'string'],
            'shipping_address.city' => [Rule::requiredIf($isAddressRequired && $hasNoCustomerAddress), 'string'],
            'shipping_address.state' => [Rule::requiredIf($isAddressRequired && $hasNoCustomerAddress), 'string', 'max:2'],
            'shipping_address.zip' => [Rule::requiredIf($isAddressRequired && $hasNoCustomerAddress), 'string'],
            'shipping_address.phone' => [Rule::requiredIf($isAddressRequired && $hasNoCustomerAddress), 'string'],
            'shipping_address.flat' => ['nullable', 'string'],
        ];
    }

    protected function isAddressRequired(): bool
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
