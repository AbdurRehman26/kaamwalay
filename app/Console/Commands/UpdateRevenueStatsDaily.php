<?php

namespace App\Console\Commands;

use App\Models\OrderPayment;
use App\Models\RevenueStatsDaily;
use App\Services\Order\RevenueStatsService;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class UpdateRevenueStatsDaily extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'revenue-stats:daily {date : YYYY-MM-DD format}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update Revenue and Profit Stats Daily at 12:20 am';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $currentDate = Carbon::parse($this->argument('date')) ?? Carbon::now()->subDays(1);

        $formattedDate = $currentDate->format('Y-m-d');

        Log::info("Revenue Stats Daily for Date : ".$formattedDate);

        $revenueStatsService = new RevenueStatsService($formattedDate);
        $revenueStatsService->addStats();

        Log::info("Revenue Stats Daily for Date : ".$formattedDate. " Completed");

        return 0;
    }
}
