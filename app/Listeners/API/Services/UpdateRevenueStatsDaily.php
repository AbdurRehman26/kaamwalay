<?php

namespace App\Listeners\API\Services;

use App\Events\API\Customer\Order\OrderPaid;
use App\Models\RevenueStatsDaily;
use Carbon\Carbon;

class UpdateRevenueStatsDaily
{
    public function handle(OrderPaid $event)
    {
        $revenue = RevenueStatsDaily::updateOrCreate([
            'event_at' => Carbon::now()->toDateString(),
        ]);

        $revenue->increment('profit', $event->order->grand_total);
        $revenue->increment('revenue', ($event->order->service_fee - $event->order->orderPayment()->provider_fee));

    }
}
