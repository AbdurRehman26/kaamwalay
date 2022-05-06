<?php

namespace Database\Seeders;

use App\Models\CouponLog;
use App\Models\CouponStat;
use App\Models\Order;
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
        $couponLogs = CouponLog::select('coupon_id')->groupBy('coupon_id')->get()->toArray();
        foreach($couponLogs as $log){

            $couponStat = CouponStat::find($log['coupon_id']);
            $orders = Order::where('coupon_id', $log['coupon_id'])->get();
            $totalCards = 0;

            foreach($orders as $order) {
                $cards = Order::find($order->id)->orderItems()->sum('quantity');
                $totalCards += $cards;
                $couponStat->total_cards = $totalCards;
                $couponStat->save();
                Log::info('Total Cards updated for Coupon :: ' . $log['coupon_id']);
            }
        }
    }
}


