<?php

namespace App\Exceptions\API\Admin\Order\OrderItem;

use Exception;

class IncorrectOrderItemStatus extends Exception
{
    protected $message = 'Action not allowed for current order item status.';
}
