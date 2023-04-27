<?php

namespace App\Console\Commands\ReferralProgram;

use App\Models\ReferrerEarnedCommission;
use App\Notifications\ReferralProgram\TopReferrersStatsNotification;
use Carbon\Carbon;
use DB;
use Illuminate\Console\Command;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Notification;

class SendTopReferrersStats extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'referrer:send-top-referrers-stats {date? : YYYY-MM-DD format}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send top referrers stats daily at 12:20 am';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $endDate = (Carbon::parse($this->argument('date')))->endOfDay()->format('Y-m-d');
        $topReferrersStats = ['date' => $endDate, 'data' => $this->getData(Carbon::parse($endDate)->startOfMonth()->format('Y-m-d'), $endDate)];

        $this->info('Top Referrers Stats for Month : ' . Carbon::parse($endDate)->format('F-Y') . ' Starting');

        if (app()->environment('local')) {
            Notification::route('slack', config('services.slack.channel_webhooks.closes_ags'))
                ->notify(new TopReferrersStatsNotification($topReferrersStats));
        }

        $this->info('Top Referrers Stats for Month : ' . Carbon::parse($endDate)->format('F-Y') . ' Completed');

        return 0;
    }

    /**
     * @return Collection<int,ReferrerEarnedCommission>
     */
    protected function getData(string $startDate, string $endDate): Collection
    {
        /*
         * Since the referrer_earned_commissions will only have paid order Ids associated with referrers
         * We are doing a join with orders to perform a whereBetween on created_at date and to get the sum of all grand_total
         * Another join is on users to get the referrer's Full name
         * Ordering by descending on total, so it will be in correct order
         * Limiting is the maximum referrers need to be shown
         * */
        return ReferrerEarnedCommission::join('orders', 'orders.id', '=', 'referrer_earned_commissions.order_id')
            ->join('referrers', 'referrers.id', '=', 'referrer_earned_commissions.referrer_id')
            ->join('users', 'users.id', '=', 'referrers.user_id')
            ->whereBetween('orders.created_at', [$startDate, $endDate])
            ->groupBy('referrer_earned_commissions.referrer_id')
            ->select(DB::raw('CONCAT(users.first_name, " ", users.last_name) as full_name'), DB::raw('sum(orders.grand_total) as total'))
            ->orderByDesc('total')
            ->limit(10)
            ->get();
    }
}
