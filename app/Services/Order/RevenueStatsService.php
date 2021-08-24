<?php

namespace App\Services\Order;

use App\Models\OrderPayment;
use App\Models\RevenueStatsDaily;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class RevenueStatsService
{
    protected string $date;
    public function __construct($date)
    {
        $this->date = Carbon::parse($date)->format('Y-m-d');
    }

    public function addStats()
    {
        $currentDate = $this->date;
        /*Using order payments instead of orders
        because we might take payments of some orders
        not on the same day*/

        $orderPayments = OrderPayment::whereDate('created_at', $currentDate)->get();

        $revenueData = [
            'profit' => 0,
            'revenue' => 0,
            'event_at' => $currentDate,
        ];

        $orderPayments->map(function ($orderPayment) use ($revenueData) {
            $revenueData['profit'] += $orderPayment->order->grand_total;
            $revenueData['revenue'] += ($orderPayment->order->service_fee - $orderPayment->provider_fee);
        });

        $dailyRevenue = RevenueStatsDaily::firstOrCreate('event_at', $currentDate);

        if ($dailyRevenue['profit'] != $revenueData['profit'] || $dailyRevenue['revenue'] != $revenueData['revenue']) {
            Log::info("Discrepancy found in the revenue stats");
            Log::info("Revenue stats in database -> Profit: ".$dailyRevenue['profit']. ", Revenue: ". $dailyRevenue['revenue']);
            Log::info("Revenue stats in calculated from Orders -> Profit: ".$revenueData['profit']. ", Revenue: ". $revenueData['revenue']);
            Log::info("Updating Revenue Stats");

            $dailyRevenue->profit = $revenueData['profit'];
            $dailyRevenue->revenue = $revenueData['revenue'];
        }

        $dailyRevenue->save();
    }
}
