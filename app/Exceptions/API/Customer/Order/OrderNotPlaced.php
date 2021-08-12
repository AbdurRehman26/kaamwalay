<?php

namespace App\Exceptions\API\Customer\Order;

use Exception;

class OrderNotPlaced extends Exception
{
    protected $message = 'Order could not be placed';
}
