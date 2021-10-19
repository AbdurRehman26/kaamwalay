<?php

namespace App\Http\Requests\API\Admin\Order;

use App\Models\Order;
use App\Models\OrderPayment;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Arr;
use Illuminate\Validation\Rule;

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
                    /* @var Order $order */
                    $order = $this->route('order');
                    $orderPayment = $order->firstOrderPayment;
                    $isRefunded = $orderPayment->response['refunded'] ?? false;
                    $refundedAmount = $orderPayment->response['amount_refunded'] ?? 0;
                    if ($isRefunded) {
                        $fail('Order total amount is already refunded.');
                    }
                    if ($value > (($order->grand_total_cents - $refundedAmount) / 1000)) {
                        $fail('The '.$attribute.' is greater than the refundable amount.');
                    }
                },
            ],
        ];
    }
}
