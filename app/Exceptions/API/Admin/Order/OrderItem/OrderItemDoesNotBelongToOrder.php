<?php

namespace App\Exceptions\API\Admin\Order\OrderItem;

use Exception;

class OrderItemDoesNotBelongToOrder extends Exception
{
    protected $message = 'Item does not belong to that order';
}
