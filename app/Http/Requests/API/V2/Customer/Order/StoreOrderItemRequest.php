<?php

namespace App\Http\Requests\API\V2\Customer\Order;

use App\Models\Order;
use Illuminate\Foundation\Http\FormRequest;

class StoreOrderItemRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        /** @var Order $order */
        $order = $this->route('order');

        return $order->isPayable();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'card_product_id' => ['required', 'integer', 'exists:card_products,id'],
            'quantity' => ['required', 'integer'],
            'declared_value_per_unit' => ['required', 'integer'],
        ];
    }
}
