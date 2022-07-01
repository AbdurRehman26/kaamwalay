<?php

namespace App\Console\Commands\StatsReport;

use App\Services\StatsReport\StatsReportIntervals\MonthlyStatsReportService;
use App\Services\StatsReport\StatsReportIntervals\WeeklyStatsReportService;
use App\Services\StatsReport\StatsReportIntervals\YearlyStatsReportService;
use App\Services\StatsReport\StatsReportService;
use Illuminate\Console\Command;

class SendStatsReportEmail extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'stats-report:send-email {interval=weekly}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    protected array $statsReportIntervals = [
        'weekly' => WeeklyStatsReportService::class,
        'monthly' => MonthlyStatsReportService::class,
        'yearly' => YearlyStatsReportService::class
    ];

    public function handle(StatsReportService $statsReportService): int
    {
        $statsReportService->generateReportFor(
            resolve(
                $this->statsReportIntervals[$this->option('interval')]
            ));

        return 0;
    }
}
