<?php

namespace App\Services\Order;

use App\Models\Order;
use App\Models\OrderPayment;
use App\Models\OrderStatus;
use App\Models\RevenueStatsDaily;
use App\Models\RevenueStatsMonthly;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class RevenueStatsService
{
    public function addDailyStats(string $currentDate): RevenueStatsDaily
    {
        // Using order payments instead of orders because we might take payments
        // of some orders not on the same day.
        $orderPayments = OrderPayment::join('orders', function ($join) {
            $join->on('orders.id', '=', 'order_payments.order_id');
        })
            ->join('order_status_histories', 'order_status_histories.order_id', '=', 'orders.id')
            ->where('order_status_histories.order_status_id', OrderStatus::PLACED)
            ->whereDate('order_payments.created_at', $currentDate)
            ->select('order_payments.*')
            ->get();

        $Revenue = RevenueStatsDaily::firstOrCreate(['event_at' => $currentDate]);

        
        Log::info("Calculation For Daily Stats Started");
        $this->addStats($currentDate, $orderPayments, $Revenue);
        Log::info("Calculation For Daily Stats Completed");

        return $Revenue;
    }

    public function addMonthlyStats(string $currentDate): RevenueStatsMonthly
    {
        $startOFMonth = Carbon::parse($currentDate)->firstOfMonth();
        $endOFMonth = Carbon::parse($currentDate)->endOfMonth();
        $year = Carbon::parse($currentDate)->format('Y');
        $orderPayments = OrderPayment::join('orders', function ($join) {
            $join->on('orders.id', '=', 'order_payments.order_id');
        })->where('orders.order_status_id', OrderStatus::STATUSES['placed'])
            ->whereBetween('order_payments.created_at', [$startOFMonth, $endOFMonth])
            ->select('order_payments.*')
            ->get();
            
        $Revenue = RevenueStatsMonthly::firstOrCreate(['event_at' => $currentDate]);
        
        Log::info("Calculation For Monthly Stats Started");
        $this->addStats($currentDate, $orderPayments, $Revenue);
        Log::info("Calculation For Monthly Stats Completed");

        return $Revenue;
    }

    public function addStats($currentDate, $orderPayments, $Revenue)
    {
        $revenueData = [
            'profit' => 0,
            'revenue' => 0,
            'event_at' => $currentDate,
        ];

        foreach ($orderPayments as $orderPayment) {
            $revenueData['profit'] += $this->calculateProfit($orderPayment);
            $revenueData['revenue'] += $this->calculateRevenue($orderPayment);
        }

        if ($Revenue['profit'] !== $revenueData['profit'] || round($Revenue['revenue'], 2) !== round($revenueData['revenue'], 2)) {
            Log::info("Discrepancy found in the revenue stats");
            Log::info("Revenue stats in database ->  Profit: " . $Revenue['profit'] . ",  Revenue: " . $Revenue['revenue']);
            Log::info("Revenue stats in calculated from Orders ->  Profit: " . $revenueData['profit'] . ",  Revenue: " . $revenueData['revenue']);
            Log::info("Updating Revenue Stats");
           
            $Revenue->profit = $revenueData['profit'];
            $Revenue->revenue = $revenueData['revenue'];
        }
        $Revenue->save();

        return $Revenue;
    }

    public function updateStats(string $currentDate, Order $order): RevenueStatsDaily
    {
        $revenue = RevenueStatsDaily::updateOrCreate(['event_at' => $currentDate]);
        $this->calculateStats($revenue);

        return $revenue;
    }

    public function updateMonthlyStats(string $currentDate, Order $order): RevenueStatsMonthly
    {
        $revenue = RevenueStatsMonthly::updateOrCreate(['event_at' => $currentDate]);
        $this->calculateStats($revenue);

        return $revenue;
    }

    public function calculateStats(Order $order, $revenue)
    {
        $revenue->increment('profit', $this->calculateProfit($order->orderPayment));
        $revenue->increment('revenue', $this->calculateRevenue($order->orderPayment));

        return $revenue;
    }

    protected function calculateRevenue(OrderPayment $orderPayment): float
    {
        return $orderPayment->order->grand_total;
    }

    protected function calculateProfit(OrderPayment $orderPayment): float
    {
        return ($orderPayment->order->service_fee - $orderPayment->provider_fee);
    }
}
