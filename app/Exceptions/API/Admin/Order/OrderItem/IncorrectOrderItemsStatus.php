<?php

namespace App\Exceptions\API\Admin\Order\OrderItem;

use Exception;

class IncorrectOrderItemsStatus extends Exception
{
    protected $message = 'Action not allowed for order items status.';
}
