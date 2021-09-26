<?php

namespace App\Exceptions\API\Admin;

use Exception;
use Symfony\Component\HttpFoundation\Response;

class IncorrectOrderStatus extends Exception
{
    protected $message = 'Action not allowed for current order status.';
    protected $code = Response::HTTP_BAD_REQUEST;
}
