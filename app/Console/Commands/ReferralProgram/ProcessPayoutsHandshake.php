<?php

namespace App\Console\Commands\ReferralProgram;

use App\Models\ReferrerPayout;
use App\Models\ReferrerPayoutStatus;
use App\Services\Admin\V3\ReferralProgram\ReferrerPayoutService;
use Carbon\Carbon;
use Illuminate\Console\Command;

class ProcessPayoutsHandshake extends Command
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
        $referrerPayoutService = new ReferrerPayoutService();

        $incompletePayouts = ReferrerPayout::with(['referrerPayoutStatus','user','user.referrer'])
            ->where('referrer_payout_status_id', '<=', ReferrerPayoutStatus::STATUS_PROCESSING)
            ->whereNotNull('transaction_id')->get();

        foreach ($incompletePayouts as $payout) {
            $limitDate = (new Carbon($payout->initiated_at))->addDays(30)->endOfDay();

            if (now() < $limitDate) {
                $referrerPayoutService->processPayoutHandshake($payout);
            } else {
                $payout->update([
                    'referrer_payout_status_id' => ReferrerPayoutStatus::STATUS_FAILED,
                ]);

                $payout->user->referrer->increment('withdrawable_commission', $payout->amount);
            }
        }

        return 0;
    }
}
