<?php

namespace App\Http\Requests\API\V1\Customer\Order;

use App\Models\Order;
use Illuminate\Foundation\Http\FormRequest;

class UpdateOrderItemRequest extends FormRequest
{
    public function authorize(): bool
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
