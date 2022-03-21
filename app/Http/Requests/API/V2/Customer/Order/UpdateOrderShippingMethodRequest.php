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

        return $user->is($order->user) && $order->isPayable('v2');
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
            'customer_address_id' => [
                'nullable',
                'exists:customer_addresses,id',
            ],
            'shipping_address' => [
                Rule::requiredIf($this->isShippingAddressFieldsRequired()),
                'array',
            ],
            'shipping_address.first_name' => [
                Rule::requiredIf($this->isShippingAddressFieldsRequired()),
                'string',
            ],
            'shipping_address.last_name' => [
                Rule::requiredIf($this->isShippingAddressFieldsRequired()),
                'string',
            ],
            'shipping_address.address' => [
                Rule::requiredIf($this->isShippingAddressFieldsRequired()),
                'string',
            ],
            'shipping_address.city' => [
                Rule::requiredIf($this->isShippingAddressFieldsRequired()),
                'string',
            ],
            'shipping_address.state' => [
                Rule::requiredIf($this->isShippingAddressFieldsRequired()),
                'string',
                'max:2',
            ],
            'shipping_address.zip' => [
                Rule::requiredIf($this->isShippingAddressFieldsRequired()), 'string',
            ],
            'shipping_address.phone' => [
                Rule::requiredIf($this->isShippingAddressFieldsRequired()), 'string',
            ],
            'shipping_address.flat' => ['nullable', 'string'],
        ];
    }

    protected function isShippingAddressFieldsRequired(): bool
    {
        return $this->input('shipping_method_id') === ShippingMethod::INSURED_SHIPPING
            && empty($this->input('customer_address_id'));
    }
}
