<?php

namespace App\Exceptions\Services\Payment;

use Exception;

class PaymentMethodNotDeletedException extends Exception
{
    /**
     * @var string
     */
    protected $message = 'Unable to delete payment method. Please try again later.';
}
