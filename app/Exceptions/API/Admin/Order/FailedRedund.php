<?php

namespace App\Exceptions\API\Admin\Order;

use Exception;
use Symfony\Component\HttpFoundation\Response;

class FailedRedund extends Exception
{
    protected $message = 'Refund is Failed due to some error';
    protected $code = Response::HTTP_UNPROCESSABLE_ENTITY;
}
