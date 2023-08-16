<?php

namespace App\Console;

use App\Console\Commands\Coupon\ActivateCoupons;
use App\Console\Commands\Coupon\ExpireCoupons;
use App\Console\Commands\Orders\ProcessPaymentHandshake;
use App\Console\Commands\ReferralProgram\ProcessPayoutsHandshake;
use App\Console\Commands\ReferralProgram\SendTopReferrersStats;
use App\Console\Commands\RevenueStats\SendUnpaidOrdersStats;
use App\Console\Commands\RevenueStats\UpdateRevenueStats;
use App\Console\Commands\Salesman\SendSalesmenStats;
use App\Console\Commands\SendAdminReports;
use App\Console\Commands\SendScheduledEmails;
use Carbon\Carbon;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        $timezone = Carbon::now('America/New_York');

        $schedule->command('horizon:snapshot')->everyFiveMinutes();
        $schedule->command('cache:prune-stale-tags')->hourly();
        $schedule->command(UpdateRevenueStats::class, [$timezone->subDays(1)->format('Y-m-d')])
            ->dailyAt('00:05')->timezone('America/New_York');
        $schedule->command(SendUnpaidOrdersStats::class, [$timezone->subDays(1)->format('Y-m-d')])
            ->dailyAt('00:05')->timezone('America/New_York');
        $schedule->command(SendScheduledEmails::class)->everyFifteenMinutes();
        $schedule->command(ActivateCoupons::class)->everyThirtyMinutes();
        $schedule->command(ExpireCoupons::class)->everyThirtyMinutes();
        $schedule->command(ProcessPaymentHandshake::class, ['--email=platform@robograding.com'])->everyFiveMinutes();
        $schedule->command(SendAdminReports::class)->dailyAt('00:20')->environments(['production', 'local', 'testing']);
        $schedule->command(ProcessPayoutsHandshake::class)->everyFiveMinutes()->withoutOverlapping();
        $schedule->command(SendTopReferrersStats::class, [$timezone->subDay()->format('Y-m-d')])
            ->dailyAt('00:05')->timezone('America/New_York');
        $schedule->command(SendSalesmenStats::class, [$timezone->subDay()->format('Y-m-d')])
            ->dailyAt('00:05')->timezone('America/New_York');
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
