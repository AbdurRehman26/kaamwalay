<?php

namespace App\Services\Order;

use App\Models\Order;
use App\Models\OrderPayment;
use App\Models\RevenueStatsDaily;
use App\Models\RevenueStatsMonthly;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class RevenueStatsService
{
    public function addDailyStats(string $currentDate): RevenueStatsDaily
    {
        $orderPayments = OrderPayment::forValidPaidOrders()
            ->forDate($currentDate)
            ->groupBy('order_payments.order_id')
            ->select(
                'order_payments.order_id',
                DB::raw('SUM(CASE WHEN order_payments.type = ' . OrderPayment::TYPE_REFUND . ' THEN (-1 * order_payments.amount) ELSE order_payments.amount END) as amount'),
                DB::raw('SUM(CASE WHEN order_payments.type = ' . OrderPayment::TYPE_REFUND . ' THEN (-1 * order_payments.provider_fee) ELSE order_payments.provider_fee END) as provider_fee'),
            )
            ->get();

        $revenue = RevenueStatsDaily::firstOrCreate(['event_at' => $currentDate]);
        
        Log::info("Calculation For Daily Stats Started");
        $this->addStats($currentDate, $orderPayments, $revenue);
        Log::info("Calculation For Daily Stats Completed");

        return $revenue;
    }

    public function addMonthlyStats(string $currentDate): RevenueStatsMonthly
    {
        $orderPayments = OrderPayment::forValidPaidOrders()
            ->forMonth($currentDate)
            ->groupBy('order_payments.order_id')
            ->select(
                'order_payments.order_id',
                DB::raw('SUM(CASE WHEN order_payments.type = ' . OrderPayment::TYPE_REFUND . ' THEN (-1 * order_payments.amount) ELSE order_payments.amount END) as amount'),
                DB::raw('SUM(CASE WHEN order_payments.type = ' . OrderPayment::TYPE_REFUND . ' THEN (-1 * order_payments.provider_fee) ELSE order_payments.provider_fee END) as provider_fee'),
            )
            ->get();

        $revenue = RevenueStatsMonthly::firstOrCreate(['event_at' => $currentDate]);
        
        Log::info("Calculation For Monthly Stats Started");
        $this->addStats($currentDate, $orderPayments, $revenue);
        Log::info("Calculation For Monthly Stats Completed");

        return $revenue;
    }

    protected function addStats($currentDate, $orderPayments, $revenue)
    {
        $revenueData = [
            'profit' => 0,
            'revenue' => 0,
            'event_at' => $currentDate,
        ];

        foreach ($orderPayments as $orderPayment) {
            $revenueData['profit'] += $this->calculateProfit($orderPayment);
            $revenueData['revenue'] += $orderPayment->amount;
        }

        if (
            $revenue['profit'] !== $revenueData['profit'] ||
            round($revenue['revenue'], 2) !== round($revenueData['revenue'], 2)
        ) {
            Log::info("Discrepancy found in the revenue stats");
            Log::info("Revenue stats in database ->  Profit: " . $revenue['profit'] . ",  Revenue: " . $revenue['revenue']);
            Log::info("Revenue stats in calculated from Orders ->  Profit: " . $revenueData['profit'] . ",  Revenue: " . $revenueData['revenue']);
            Log::info("Updating Revenue Stats");
           
            $revenue->profit = $revenueData['profit'];
            $revenue->revenue = $revenueData['revenue'];
        }
        $revenue->save();

        return $revenue;
    }

    public function updateStats(string $currentDate, Order $order): RevenueStatsDaily
    {
        $revenue = RevenueStatsDaily::updateOrCreate(['event_at' => $currentDate]);
        $this->calculateStats($order, $revenue);

        return $revenue;
    }

    public function updateMonthlyStats(string $currentDate, Order $order): RevenueStatsMonthly
    {
        $revenue = RevenueStatsMonthly::updateOrCreate(['event_at' => $currentDate]);
        $this->calculateStats($order, $revenue);

        return $revenue;
    }

    protected function calculateStats(Order $order, $revenue)
    {
        $calculatedProfit = $revenue->profit ?? 0;
        $calculatedRevenue = $revenue->revenue ?? 0;

        $order->orderPayments->map(function ($payment) use (&$calculatedProfit, &$calculatedRevenue) {
            $calculatedProfit += $this->calculateProfit($payment);
            $calculatedRevenue += $this->calculateRevenue($payment);

            return $payment;
        });

        $revenue->increment('profit', $calculatedProfit);
        $revenue->increment('revenue', $calculatedRevenue);

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
