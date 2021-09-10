<?php

namespace App\Exceptions\API\Admin;

use Exception;

class OrderStatusHistoryWasAlreadyAssigned extends Exception
{
    protected $message = 'The order status has been assigned already.';
}
