<?php

namespace App\Exceptions\Services\Payment;

use Exception;

class FailedPaymentMethodDeleteException extends Exception
{
    protected $message = 'Unable to delete payment method. Please try again later.';
}
