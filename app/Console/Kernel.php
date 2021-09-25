<?php

namespace App\Console;

use App\Console\Commands\Orders\ExportOrders;
use App\Console\Commands\RevenueStats\UpdateRevenueStatsDaily;
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
        $schedule->command(ExportOrders::class, [Carbon::now()->subDays(1)->format('Y-m-d')])
        ->dailyAt('00:10');
        $schedule->command(UpdateRevenueStatsDaily::class, [Carbon::now()->subDays(1)->format('Y-m-d')])
            ->dailyAt('00:20');
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
