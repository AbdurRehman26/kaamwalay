<?php

namespace App\Exceptions\Services\AGS;

use Exception;
use Symfony\Component\HttpFoundation\Response;

class OrderLabelCouldNotBeGeneratedException extends Exception
{
    /** @var string */
    protected $message = 'Order label could not be generated';

    /** @var int */
    protected $code = Response::HTTP_UNPROCESSABLE_ENTITY;
}
