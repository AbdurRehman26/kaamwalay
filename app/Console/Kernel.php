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
use App\Console\Commands\SendOpsStatsCommand;
use App\Console\Commands\SendScheduledEmails;
use App\Console\Commands\SendScheduledNotificationsCommand;
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
        $schedule->command('horizon:snapshot')->everyFiveMinutes();
        $schedule->command('cache:prune-stale-tags')->hourly();
        $schedule->command(UpdateRevenueStats::class, [Carbon::now()->subDay(), Carbon::now()])
            ->timezone('America/New_York')->dailyAt('00:05');
        $schedule->command(SendUnpaidOrdersStats::class, [Carbon::now()->subDay(), Carbon::now()])
            ->timezone('America/New_York')->dailyAt('00:05');
        $schedule->command(SendScheduledEmails::class)->everyFifteenMinutes();
        $schedule->command(SendScheduledNotificationsCommand::class)->everyFifteenMinutes();
        $schedule->command(ActivateCoupons::class)->everyThirtyMinutes();
        $schedule->command(ExpireCoupons::class)->everyThirtyMinutes();
        $schedule->command(ProcessPaymentHandshake::class, ['--email=platform@robograding.com'])->everyFiveMinutes();
        $schedule->command(SendAdminReports::class)->dailyAt('00:20')->environments(['production', 'local', 'testing']);
        $schedule->command(ProcessPayoutsHandshake::class)->everyFiveMinutes()->withoutOverlapping();
        $schedule->command(SendTopReferrersStats::class, [Carbon::now()->subDay()])
            ->timezone('America/New_York')->dailyAt('00:05');
        $schedule->command(SendSalesmenStats::class, [Carbon::now()->subDay()])
            ->timezone('America/New_York')->dailyAt('00:05');
        $schedule->command(SendOpsStatsCommand::class, [Carbon::now()->subDay(), Carbon::now()])
            ->timezone('America/New_York')->dailyAt('00:05');
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
