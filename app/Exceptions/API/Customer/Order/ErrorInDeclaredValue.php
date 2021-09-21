<?php

namespace App\Exceptions\API\Customer\Order;

use Exception;

class ErrorInDeclaredValue extends Exception
{
    protected $message = 'Declared value of any card must not be greater than service level maximum protection. Please go back and update.';
}
