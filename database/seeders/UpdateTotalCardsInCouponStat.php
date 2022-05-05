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
        $couponLogs = CouponLog::all();
        foreach($couponLogs as $log){
            $totalCards = 0;
            $couponStat = CouponStat::find($log->coupon_id);
            $cards = Order::find($log->order_id)->orderItems()->sum('quantity');
            $totalCards += $cards;
            $couponStat->total_cards = $totalCards;
            $couponStat->save();
        }
    }
}


