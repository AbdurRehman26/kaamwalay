<?php

namespace App\Console\Commands\Coupon;

use App\Models\CouponLog;
use App\Models\CouponStat;
use App\Models\Order;
use DB;
use Illuminate\Console\Command;
use Log;

class UpdateTotalCardsInCouponStatCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'coupons:update-total-cards';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This command will update total cards ordered using a specific coupon';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $couponLogs = CouponLog::select('coupon_id')->groupBy('coupon_id')->get();
        foreach ($couponLogs as $log) {
            $totalCards = 0;
            Order::join('order_items', 'order_items.order_id', 'orders.id')
            ->where('orders.coupon_id', $log['coupon_id'])
            ->select(DB::raw('SUM(order_items.quantity) as quantity'))
            ->get()->each(function ($item) use ($totalCards, $log) {
                // @phpstan-ignore-next-line
                $totalCards += $item->quantity;
                $couponStat = CouponStat::find($log['coupon_id']);
                if($couponStat){
                    $couponStat->total_cards = $totalCards;
                    $couponStat->save();
                    Log::info('Total Cards updated for Coupon :: ' . $log['coupon_id']);
                }
            });
        }

        return Command::SUCCESS;
    }
}
