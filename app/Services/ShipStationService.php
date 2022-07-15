<?php

namespace App\Services;

use App\Http\APIClients\ShipStationClient;
use App\Models\Order;

class ShipStationService
{
    public function __construct(protected ShipStationClient $shipStationClient)
    {
    }

    public function createOrder(Order $order): void
    {
        if (app()->environment('local')) {
            return;
        }

        $this->shipStationClient->createOrder($order);
    }
}
