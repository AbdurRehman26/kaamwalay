<?php

namespace App\Http\Requests\API\V1\Admin\Order;

use Illuminate\Foundation\Http\FormRequest;

class RefundOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return $this->user()->isAdmin();
    }

    protected function prepareForValidation()
    {
        if (! $this->has('add_to_wallet')) {
            $this->merge([
                'add_to_wallet' => false,
            ]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'notes' => ['required'],
            'add_to_wallet' => ['required', 'boolean'],
            'amount' => [
                'required',
                'numeric',
                function ($attribute, $value, $fail) {
                    $order = $this->route('order');
                    $orderPayment = $order?->firstOrderPayment;
                    $refundableAmount = $orderPayment?->amount - $order->refund_total;
                    if (
                        $value > $refundableAmount
                    ) {
                        $fail("The $attribute is invalid. The maximum refundable amount is: \$$refundableAmount");
                    }
                },
            ],
        ];
    }
}
