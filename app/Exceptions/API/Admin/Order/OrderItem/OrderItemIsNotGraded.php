<?php

namespace App\Exceptions\API\Admin\Order\OrderItem;

use Exception;

class OrderItemIsNotGraded extends Exception
{
    protected $message = 'Order item does not fulfill the criteria to be marked as Graded.';
}
