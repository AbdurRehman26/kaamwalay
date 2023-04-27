<?php

namespace App\Console\Commands\ReferralProgram;

use App\Models\ReferrerEarnedCommission;
use App\Notifications\ReferralProgram\TopPartnersStats;
use DB;
use Illuminate\Console\Command;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;
use Carbon\Carbon;

class SendTopPartnersStats extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'referrer:top-referrers {date? : YYYY-MM-DD format}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send top partners stats daily at 12:20 am';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $currentDate = (Carbon::parse($this->argument('date')))->startOfDay()->format('Y-m-d');
        $topPartnersStats = ['date' => $currentDate, 'data' => $this->getData($currentDate)];

        $this->log('Top Partners Stats for Month : ' . Carbon::parse($currentDate)->format('F-Y') . ' Starting');

        if (!app()->environment('local')) {
            Notification::route('slack', config('services.slack.channel_webhooks.closes_ags'))
                ->notify(new TopPartnersStats($topPartnersStats));
        }

        $this->log('Top Partners Stats for Month : ' . Carbon::parse($currentDate)->format('F-Y') . ' Completed');

        return 0;
    }

    protected function log(string $message, array $context = []): void
    {
        $this->info($message);
        Log::info($message, $context);
    }

    protected function getData($currentDate): Collection
    {
        return ReferrerEarnedCommission::join('orders', 'orders.id', '=', 'referrer_earned_commissions.order_id')
            ->join('referrers', 'referrers.id', '=', 'referrer_earned_commissions.referrer_id')
            ->join('users', 'users.id', '=', 'referrers.user_id')
            ->whereBetween('orders.created_at', [Carbon::parse($currentDate)->startOfMonth(), $currentDate])
            ->groupBy('referrer_earned_commissions.referrer_id')
            ->select(DB::raw('CONCAT(users.first_name, " ", users.last_name) as full_name'), DB::raw('sum(orders.grand_total) as total'))
            ->orderByDesc('total')
            ->limit(3)
            ->get();
    }
}
