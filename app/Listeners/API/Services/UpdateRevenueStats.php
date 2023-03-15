<?php

namespace App\Listeners\API\Services;

use App\Events\API\Customer\Order\OrderPaid;
use App\Services\Order\RevenueStatsService;
use Carbon\Carbon;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class UpdateRevenueStats implements ShouldQueue
{
    use InteractsWithQueue;

    public $tries = 5;

    public function __construct(protected RevenueStatsService $revenueStatsService)
    {
    }

    public function handle(OrderPaid $event): void
    {
        $this->revenueStatsService->updateStats(Carbon::now()->format('Y-m-d'), $event->order);
        $this->revenueStatsService->updateMonthlyStats(Carbon::now()->format('Y-m-d'), $event->order);
    }
}
