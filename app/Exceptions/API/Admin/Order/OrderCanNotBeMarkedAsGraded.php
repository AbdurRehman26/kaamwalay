<?php

namespace App\Exceptions\API\Admin\Order;

use Exception;

class OrderCanNotBeMarkedAsGraded extends Exception
{
    protected $message = 'Order does not fulfill the criteria to be mark as graded.';
}
