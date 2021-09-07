<?php

namespace App\Exceptions\API\Admin\Order\OrderItem;

use Exception;

class ItemDontBelongToOrder extends Exception
{
    protected $message = 'Item does not belong to that order';
}
