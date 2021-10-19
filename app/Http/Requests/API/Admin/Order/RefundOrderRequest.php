<?php

namespace App\Http\Requests\API\Admin\Order;

use App\Models\OrderPayment;
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

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'notes' => ['required'],
            'amount' => [
                'required',
                'numeric',
                function ($attribute, $value, $fail) {
                    $orderPayment = OrderPayment::find($this->route('orderPayment'));
                    if (
                        $value > $orderPayment->amount
                        || $orderPayment->type === OrderPayment::PAYMENT_TYPES['refund']
                    ) {
                        $fail('The '.$attribute.' is invalid.');
                    }
                },
            ],
        ];
    }
}
