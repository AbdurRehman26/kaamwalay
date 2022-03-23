<?php

namespace App\Rules\Order;

use App\Models\Order;
use Illuminate\Contracts\Validation\DataAwareRule;
use Illuminate\Contracts\Validation\Rule;

class RefundAmountRule implements Rule, DataAwareRule
{
    protected array $data = [];

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     */
    public function passes($attribute, $value): bool
    {
        if ((float) $value > $this->maxRefundableAmount()) {
            return false;
        }

        return true;
    }

    public function message(): string
    {
        return 'The amount is invalid. The maximum refundable amount is: ' . $this->maxRefundableAmount();
    }

    /**
     * Set the data under validation.
     *
     * @param  array  $data
     * @return self
     */
    public function setData($data)
    {
        $this->data = $data;

        return $this;
    }

    protected function maxRefundableAmount(): float
    {
        /** @var Order */
        $order = request()->route('order');

        if ($this->data['add_to_wallet'] === true) {
            // wallet refunds can be 100% of the order amount
            return $order->allPayments()->sum('amount') - $order->refunds()->sum('amount');
        }
        // can only be refunded to the payment method used for first charge
        // minus any refund issued to that payment method.

        $firstOrderPayment = $order->firstOrderPayment;

        if (empty($firstOrderPayment)) {
            return $order->grand_total_to_be_paid;
        }

        return (
            $firstOrderPayment->amount - $order->refunds()->where('payment_method_id', $firstOrderPayment)->sum('amount')
        );
    }
}
