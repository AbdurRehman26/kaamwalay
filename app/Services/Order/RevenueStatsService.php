<?php

namespace App\Services\Order;

use App\Models\Order;
use App\Models\OrderPayment;
use App\Models\RevenueStatsDaily;
use Illuminate\Support\Facades\Log;

class RevenueStatsService
{
    public function addStats($currentDate)
    {
        /*Using order payments instead of orders
        because we might take payments of some orders
        not on the same day*/

        $orderPayments = OrderPayment::whereDate('created_at', $currentDate)->get();

        $revenueData = [
            'profit' => 0,
            'revenue' => 0,
            'event_at' => $currentDate,
        ];

        foreach ($orderPayments as $orderPayment) {
            $revenueData['profit'] += $this->calculateProfit($orderPayment);
            $revenueData['revenue'] += $this->calculateRevenue($orderPayment);
        }

        $dailyRevenue = RevenueStatsDaily::firstOrCreate(['event_at' => $currentDate]);

        if ($dailyRevenue['profit'] != $revenueData['profit'] || $dailyRevenue['revenue'] != $revenueData['revenue']) {
            Log::info("Discrepancy found in the revenue stats");
            Log::info("Revenue stats in database -> Profit: ".$dailyRevenue['profit']. ", Revenue: ". $dailyRevenue['revenue']);
            Log::info("Revenue stats in calculated from Orders -> Profit: ".$revenueData['profit']. ", Revenue: ". $revenueData['revenue']);
            Log::info("Updating Revenue Stats");

            $dailyRevenue->profit = $revenueData['profit'];
            $dailyRevenue->revenue = $revenueData['revenue'];
        }
        $dailyRevenue->save();

        return $dailyRevenue;
    }

    /**
     * @param Order $order
     * @return mixed
     */
    public function calculateRevenue(OrderPayment $orderPayment)
    {
        return $orderPayment->order->grand_total;
    }

    /**
     * @param OrderPayment $orderPayment
     * @return mixed
     */
    public function calculateProfit(OrderPayment $orderPayment)
    {
        return ($orderPayment->order->service_fee - $orderPayment->provider_fee);
    }
}
