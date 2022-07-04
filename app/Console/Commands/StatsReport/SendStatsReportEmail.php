<?php

namespace App\Console\Commands\StatsReport;

use App\Mail\Admin\StatsReport\StatsReport;
use App\Models\User;
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
    protected $signature = 'stats-report:send-email {interval=weekly} {--testing=false}';

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
        $report = StatsReportService::generateReport(
            resolve(
                $this->statsReportIntervals[$this->argument('interval')]
            ));

        $users = [];

        if(!empty($this->option('testing'))){

            $users = User::whereIn('email', $this->getTestingAdminList())->get();

        }else{
//            $users = User::admin()->all();
        }

        foreach ($users as $user){
            Mail::to($user)->send(new StatsReport($report, $this->argument('interval')));
        }

        return 0;
    }


    private function getTestingAdminList(): array
    {
        return [
            'sydabdrehman@gmail.com',
            'kazmi@wooter.com',
//            'nabeel@wooter.com',
            'syedhassanmujtaba619@gmail.com',
            'hassan@wooter.com'
        ];
    }
}
