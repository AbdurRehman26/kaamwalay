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
            'customer_address_id' => [
                Rule::requiredIf($this->isShippingAddressRequired()),
                'integer',
                'exists:customer_addresses,id',
            ],
        ];
    }

    protected function isShippingAddressRequired(): bool
    {
        return ShippingMethod::where(
            'id',
            $this->input('shipping_method_id')
        )->value('code') === ShippingMethod::INSURED_SHIPPING;
    }
}
