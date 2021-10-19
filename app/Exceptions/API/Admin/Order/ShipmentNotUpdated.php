<?php

namespace App\Exceptions\API\Admin\Order;

use Exception;

class ShipmentNotUpdated extends Exception
{
    protected $message = 'Shipment could not be updated';
}
