<?php

namespace Database\Seeders;

use App\Models\CouponLog;
use App\Models\CouponStat;
use App\Models\Order;
use DB;
use Illuminate\Database\Seeder;
use Log;

class UpdateTotalCardsInCouponStat extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $couponLogs = CouponLog::select('coupon_id')->groupBy('coupon_id')->get();
        foreach ($couponLogs as $log) {
            $totalCards = 0;
            Order::join('order_items', 'order_items.order_id', 'orders.id')
            ->where('orders.coupon_id', $log['coupon_id'])
            ->select(DB::raw('SUM(order_items.quantity) as quantity'))
            ->get()->each(function ($item) use ($totalCards, $log) {
                $totalCards += $item->quantity;
                $couponStat = CouponStat::find($log['coupon_id']);
                if($couponStat){
                    $couponStat->total_cards = $totalCards;
                    $couponStat->save();
                    Log::info('Total Cards updated for Coupon :: ' . $log['coupon_id']);
                }
            });
        }
    }
}


