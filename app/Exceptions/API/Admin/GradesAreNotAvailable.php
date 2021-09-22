<?php

namespace App\Exceptions\API\Admin;

use Exception;

class GradesAreNotAvailable extends Exception
{
    protected $message = 'Grades are not available yet';
}
