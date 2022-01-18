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
     * @return bool
     */
    public function passes($attribute, $value)
    {
//        dd($value, $this->maxRefundableAmount());
        if ((float) $value > $this->maxRefundableAmount()) {
            return false;
        }

        return true;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
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
            return $order->allPayments()->sum('amount') - $order->refunds()->sum('amount');
        }

        $firstOrderPayment = $order->firstOrderPayment;

        return (
            $firstOrderPayment->amount - $order->refunds()->where('payment_method_id', $firstOrderPayment)->sum('amount')
        );
    }
}
