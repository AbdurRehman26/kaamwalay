<?php

namespace App\Listeners\API\Services;

use App\Events\API\Customer\Order\OrderPaid;
use App\Models\RevenueStatsDaily;
use App\Services\Order\RevenueStatsService;
use Carbon\Carbon;

class UpdateRevenueStatsDaily
{
    public function handle(OrderPaid $event, RevenueStatsService $revenueStatsService)
    {
        $revenue = RevenueStatsDaily::updateOrCreate([
            'event_at' => Carbon::now()->toDateString(),
        ]);

        $revenue->increment('profit', $revenueStatsService->calculateProfit($event->order->orderPayment));
        $revenue->increment('revenue', $revenueStatsService->calculateRevenue($event->order->orderPayment));
    }
}
