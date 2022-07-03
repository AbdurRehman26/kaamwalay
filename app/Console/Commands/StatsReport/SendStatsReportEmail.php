<?php

namespace App\Console\Commands\StatsReport;

use App\Mail\Admin\StatsReport\StatsReport;
use App\Services\StatsReport\StatsReportIntervals\MonthlyStatsReportService;
use App\Services\StatsReport\StatsReportIntervals\WeeklyStatsReportService;
use App\Services\StatsReport\StatsReportIntervals\YearlyStatsReportService;
use App\Services\StatsReport\StatsReportService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

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
    protected $description = 'Send email to admins of stats report for specified interval';

    protected array $statsReportIntervals = [
        'weekly' => WeeklyStatsReportService::class,
        'monthly' => MonthlyStatsReportService::class,
        'yearly' => YearlyStatsReportService::class
    ];

    public function handle(): int
    {
        $d = StatsReportService::generateReport(
            resolve(
                $this->statsReportIntervals[$this->argument('interval')]
            ));

        Mail::to(\App\Models\User::find(8585))->send(new StatsReport($d, $this->argument('interval')));

        dd($d);
        return 0;
    }
}
