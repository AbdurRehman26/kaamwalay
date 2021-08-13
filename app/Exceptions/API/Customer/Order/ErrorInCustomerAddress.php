<?php

namespace App\Exceptions\API\Customer\Order;

use Exception;

class ErrorInCustomerAddress extends Exception
{
    protected $message = 'Error in customer address';
}
