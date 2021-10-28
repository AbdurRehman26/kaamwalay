<?php

namespace App\Exceptions\API\Admin\Order;

use Exception;
use Symfony\Component\HttpFoundation\Response;

class FailedExtraCharge extends Exception
{
    /**
     * @var string
     */
    protected $message = 'We are unable to charge the customer with his last used payment method.';
    /**
     * @var int
     */
    protected $code = Response::HTTP_UNPROCESSABLE_ENTITY;
}
