<?php

namespace App\Console\Commands\ReferralProgram;

use App\Models\PayoutStatus;
use App\Models\ReferrerPayout;
use App\Models\User;
use App\Services\ReferralProgram\ReferrerService;
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
    protected $description = 'It generates Referrer objects for all User objects in the system.';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $incompletePayouts = ReferrerPayout::where('payout_status_id', '<=', PayoutStatus::STATUS_PROCESSING)->get();

        \Log::debug(count($incompletePayouts));
    }
}
