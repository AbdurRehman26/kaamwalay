<?php

namespace App\Console\Commands\ReferralProgram;

use App\Models\ReferrerPayout;
use App\Models\ReferrerPayoutStatus;
use Illuminate\Console\Command;

class ProcessPayoutsHanshake extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'referrer:payouts-handshake';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Search for incomplete payouts and checks their current status through provider.';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $incompletePayouts = ReferrerPayout::where('referrer_payout_status_id', '<=', ReferrerPayoutStatus::STATUS_PROCESSING)->get();

        \Log::debug(count($incompletePayouts));
    }
}
