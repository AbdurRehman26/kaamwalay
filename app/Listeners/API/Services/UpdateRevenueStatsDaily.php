<?php

namespace App\Listeners\API\Services;

use App\Events\API\Customer\Order\OrderPaid;
use App\Services\Order\RevenueStatsService;
use Carbon\Carbon;

class UpdateRevenueStatsDaily
{
    public function handle(OrderPaid $event, RevenueStatsService $revenueStatsService)
    {
        $revenueStatsService->updateStats(Carbon::now()->format('Y-m-d'), $event->order);
    }
}
