<?php

namespace App\Exceptions\Services\Admin;

use Exception;
use Symfony\Component\HttpFoundation\Response;

class ReportIsNotReportableException extends Exception
{
    /** @var string */
    protected $message = 'Report is not reportable. Implement Reportable interface on the report class.';

    /** @var int */
    protected $code = Response::HTTP_UNPROCESSABLE_ENTITY;
}
