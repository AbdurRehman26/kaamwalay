<?php

namespace App\Exceptions\API\Admin;

use Exception;
use Symfony\Component\HttpFoundation\Response;

class GradesAreNotAvailable extends Exception
{
    protected $message = 'Grades are not available yet';
    protected $code = Response::HTTP_NOT_FOUND;
}
