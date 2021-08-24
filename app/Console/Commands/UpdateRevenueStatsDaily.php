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
     * The console command option.
     *
     * @var string
     */
    protected $currentDate = 'Current date attribute which will be set to yesterday by default';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
        $this->currentDate = $this->option('date') ?? Carbon::now()->subDays(1)->toDateString();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $currentDate = $this->currentDate;

        Log::info("Revenue Stats Daily for Date : ".$currentDate);

        $revenueStatsService = new RevenueStatsService($currentDate);
        $revenueStatsService->addStats();

        Log::info("Revenue Stats Daily for Date : ".$currentDate. " Completed");

        return 0;
    }
}
