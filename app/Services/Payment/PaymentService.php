<?php

namespace App\Services\Payment;

use App\Models\Order;
use App\Services\Payment\Providers\StripeService;

class PaymentService
{
    public function charge(Order $order)
    {
        switch ($order->paymentMethod->code) {
            case 'stripe':
                return (new StripeService)->charge($order);
        }

        throw new \Exception('Payment provider did not match.');
    }
}
