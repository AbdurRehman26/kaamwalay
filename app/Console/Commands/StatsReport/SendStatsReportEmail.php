<?php

namespace App\Console\Commands\StatsReport;

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

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $selectedOption = $this->choice(
            'Select interva :',
            ['All', 'Series', 'Sets', 'Cards'],
            '0'
        );

        return 0;
    }
}
