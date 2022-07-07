<?php

namespace App\Exceptions\Services\Admin;

use Exception;
use Symfony\Component\HttpFoundation\Response;

class ServiceNotReportableException extends Exception
{
    /** @var string */
    protected $message = 'Service is not reportable. Implement Reportable interface on service.';

    /** @var int */
    protected $code = Response::HTTP_UNPROCESSABLE_ENTITY;
}
