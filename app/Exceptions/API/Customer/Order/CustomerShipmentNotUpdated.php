<?php

namespace App\Exceptions\API\Customer\Order;

use Exception;

class CustomerShipmentNotUpdated extends Exception
{
    protected $message = 'Customer shipment could not be updated';
}
