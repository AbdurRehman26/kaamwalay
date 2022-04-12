<?php

namespace App\Http\Requests\API\V2\Admin\Order;

use App\Models\Order;
use App\Models\ShippingMethod;
use Illuminate\Foundation\Http\FormRequest;
use App\Http\Requests\API\V1\Admin\Order\UpdateOrderPaymentRequest as V1UpdateOrderPaymentRequest;
use Illuminate\Validation\Rule;

class UpdateShipmentRequest extends V1UpdateOrderPaymentRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        /** @var Order $order */
        $order = $this->route('order');

        return [
            'shipping_provider' => [
                Rule::requiredIf($order->shippingMethod->code === ShippingMethod::INSURED_SHIPPING),
                'string',
            ],
            'tracking_number' => [
                Rule::requiredIf($order->shippingMethod->code === ShippingMethod::INSURED_SHIPPING),
                'string',
            ],
        ];
    }
}
