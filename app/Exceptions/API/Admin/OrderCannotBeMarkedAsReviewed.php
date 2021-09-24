<?php

namespace App\Exceptions\API\Admin;

use Exception;
use Symfony\Component\HttpFoundation\Response;

class OrderCannotBeMarkedAsReviewed extends Exception
{
    protected $message = 'Order can not be marked as Reviewed due to an error occurred with AGS client.';
    protected $code = Response::HTTP_UNPROCESSABLE_ENTITY;
}
