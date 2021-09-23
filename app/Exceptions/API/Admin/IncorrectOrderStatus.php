<?php

namespace App\Exceptions\API\Admin;

use Exception;

class IncorrectOrderStatus extends Exception
{
    protected $message = 'Action not allowed for current order status.';
}
