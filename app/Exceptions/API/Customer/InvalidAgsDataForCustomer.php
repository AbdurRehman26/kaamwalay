<?php

namespace App\Exceptions\API\Customer;

use Exception;

class InvalidAgsDataForCustomer extends Exception
{
    protected $message = 'The data provided is invalid.';
}
