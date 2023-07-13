<?php

namespace App\Http\Requests\API\V3\Admin\Order;

use App\Http\Requests\API\V2\Admin\Order\StoreOrderRequest as V2StoreOrderRequest;

class StoreOrderRequest extends V2StoreOrderRequest
{
    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $rules = parent::rules();

        return array_merge($rules, [
            'has_shipping_insurance' => ['sometimes', 'boolean'],
        ]);
    }
}
