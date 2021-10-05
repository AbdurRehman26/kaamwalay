<?php

namespace App\Exceptions\API\Admin\Order;

use Exception;
use Symfony\Component\HttpFoundation\Response;

class ExtraChargeFailed extends Exception
{
    protected $message = 'Extra Charge failed';
    protected $code = Response::HTTP_UNPROCESSABLE_ENTITY;
}
