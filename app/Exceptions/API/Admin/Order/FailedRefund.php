<?php

namespace App\Exceptions\API\Admin\Order;

use Exception;
use Symfony\Component\HttpFoundation\Response;

class FailedRefund extends Exception
{
    /**
     * @var string
     */
    protected $message = 'Refund is Failed due to some error';
    /**
     * @var int
     */
    protected $code = Response::HTTP_UNPROCESSABLE_ENTITY;
}
