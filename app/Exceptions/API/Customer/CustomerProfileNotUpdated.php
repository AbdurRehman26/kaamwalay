<?php

namespace App\Exceptions\API\Customer;

use Exception;

class CustomerProfileNotUpdated extends Exception
{
    protected $message = 'Customer profile could not be updated';
}
