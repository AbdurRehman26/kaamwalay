<?php

namespace App\Console\Commands\Coupon;

use App\Models\CouponLog;
use App\Models\CouponStat;
use App\Models\Order;
use DB;
use Illuminate\Console\Command;

class UpdateTotalCardsInCouponStatCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'coupons:update-total-cards-stats';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This command updates total cards stats for coupons';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        CouponLog::select('coupon_id')->distinct()->get()->each(function (CouponLog $couponLog) {
            $totalCards = 0;
            Order::join('order_items', 'order_items.order_id', 'orders.id')
                ->where('orders.coupon_id', $couponLog->coupon_id)
                ->select(DB::raw('SUM(order_items.quantity) as quantity'))
                ->each(function ($item) use ($totalCards, $couponLog) {
                    $totalCards += $item->quantity;
                    $couponStat = CouponStat::find($couponLog->coupon_id);
                    if ($couponStat) {
                        $couponStat->total_cards = $totalCards;
                        $couponStat->save();
                        $this->info('Total cards stat updated for coupon:' . $couponLog->coupon_id);
                    }
                });
        });

        return Command::SUCCESS;
    }
}
