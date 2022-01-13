<?php

namespace App\Console;

use App\Console\Commands\Coupon\ActivateCoupons;
use App\Console\Commands\Coupon\ExpireCoupons;
use App\Console\Commands\Orders\VerifyUnpaidOrders;
use App\Console\Commands\RevenueStats\UpdateRevenueStats;
use App\Console\Commands\SendScheduledEmails;
use Carbon\Carbon;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        //
    ];

    /**
     * Define the application's command schedule.
     *
     * @param Schedule $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        $schedule->command('horizon:snapshot')->everyFiveMinutes();
        $schedule->command(UpdateRevenueStats::class, [Carbon::now()->subDays(1)->format('Y-m-d')])
            ->dailyAt('00:20');
        $schedule->command(SendScheduledEmails::class)->everyFifteenMinutes();
        $schedule->command(ActivateCoupons::class)->everyThirtyMinutes();
        $schedule->command(ExpireCoupons::class)->everyThirtyMinutes();
        $schedule->command(VerifyUnpaidOrders::class, ['platform@robograding.com'])->everyMinute();
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__ . '/Commands');

        require base_path('routes/console.php');
    }
}
