<?php

namespace App\Exceptions\API\Customer\Order;

use Exception;

class ErrorInDeclaredValue extends Exception
{
    protected $message = 'Error in declared value';
}
