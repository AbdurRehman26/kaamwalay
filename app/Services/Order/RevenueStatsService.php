<?php

namespace App\Services\Order;

use App\Models\Order;
use App\Models\OrderPayment;
use App\Models\RevenueStatsDaily;
use App\Models\RevenueStatsMonthly;
use DateTime;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Str;

class RevenueStatsService
{
    public function addDailyStats(string $currentDate): RevenueStatsDaily
    {
        $orderPayments = OrderPayment::forValidPaidOrders()
            ->forAmericanTimezoneDate($currentDate)
            ->ignoreOrdersBySpecificAdmins()
            ->groupBy('order_payments.order_id')
            ->select([
                'order_payments.order_id',
                DB::raw('SUM(CASE WHEN order_payments.type = ' . OrderPayment::TYPE_REFUND . ' THEN (-1 * order_payments.amount) ELSE order_payments.amount END) as amount'),
                DB::raw('SUM(CASE WHEN order_payments.type = ' . OrderPayment::TYPE_REFUND . ' THEN 0 ELSE order_payments.provider_fee END) as provider_fee'),
            ])
            ->get();

        $revenue = RevenueStatsDaily::firstOrCreate(['event_at' => $currentDate]);

        Log::info('Calculation For Daily Stats Started');
        $this->addStats($currentDate, $orderPayments, $revenue);
        Log::info('Calculation For Daily Stats Completed');

        return $revenue;
    }

    public function calculateDailyCardsTotal(): int
    {
        return $this->calculateCardsTotal(now('America/New_York')->subDays(1)->startOfDay(), now('America/New_York')->subDays(1)->endOfDay());
    }

    public function calculateMonthlyCardsTotal(): int
    {
        return $this->calculateCardsTotal(now('America/New_York')->subDays(1)->startOfMonth(), now('America/New_York')->subDays(1)->endOfMonth());
    }

    public function calculateCardsTotal(DateTime $startTime, DateTime $endTime): int
    {
        return Order::paid()->join('users', 'users.id', '=', 'orders.user_id')->whereNotIn(
            'users.email',
            Str::of(config('robograding.revenue_ignore_orders_admins'))->explode(',')->toArray()
        )->join('order_items', 'order_items.order_id', '=', 'orders.id')
            ->whereBetween(
                DB::raw("CONVERT_TZ(orders.created_at, 'UTC', 'America/New_York')"),
                [$startTime, $endTime]
            )->sum('order_items.quantity');
    }

    public function addMonthlyStats(string $currentDate): RevenueStatsMonthly
    {
        $orderPayments = OrderPayment::forValidPaidOrders()
            ->forAmericanTimezoneMonth($currentDate)
            ->ignoreOrdersBySpecificAdmins()
            ->groupBy('order_payments.order_id')
            ->select([
                'order_payments.order_id',
                DB::raw('SUM(CASE WHEN order_payments.type = ' . OrderPayment::TYPE_REFUND . ' THEN (-1 * order_payments.amount) ELSE order_payments.amount END) as amount'),
                DB::raw('SUM(CASE WHEN order_payments.type = ' . OrderPayment::TYPE_REFUND . ' THEN 0 ELSE order_payments.provider_fee END) as provider_fee'),
            ])
            ->get();

        $revenue = RevenueStatsMonthly::firstOrCreate(['event_at' => $currentDate]);

        Log::info('Calculation For Monthly Stats Started');
        $this->addStats($currentDate, $orderPayments, $revenue);
        Log::info('Calculation For Monthly Stats Completed');

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
            $revenueData['profit'] += $orderPayment->order->service_fee - $orderPayment->provider_fee;
            $revenueData['revenue'] += $orderPayment->amount;
        }

        if (
            $revenue['profit'] !== $revenueData['profit'] ||
            round($revenue['revenue'], 2) !== round($revenueData['revenue'], 2)
        ) {
            Log::info('Discrepancy found in the revenue stats');
            Log::info('Revenue stats in database ->  Profit: ' . $revenue['profit'] . ',  Revenue: ' . $revenue['revenue']);
            Log::info('Revenue stats in calculated from Orders ->  Profit: ' . $revenueData['profit'] . ',  Revenue: ' . $revenueData['revenue']);
            Log::info('Updating Revenue Stats');

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

        $calculatedProfit += $this->calculateProfitForOrder($order);

        $order->orderPayments->map(function ($payment) use (&$calculatedRevenue) {
            $calculatedRevenue += $payment->type === OrderPayment::TYPE_REFUND
                ? (-1 * $payment->amount)
                : $payment->amount;

            return $payment;
        });

        $revenue->update([
            'profit' => $calculatedProfit,
            'revenue' => $calculatedRevenue,
        ]);

        return $revenue;
    }

    protected function calculateProfitForOrder(Order $order): float
    {
        return $order->service_fee - $this->getOrderTotalProviderFee($order);
    }

    protected function getOrderTotalProviderFee(Order $order): float
    {
        return $order->firstOrderPayment?->provider_fee
            + $order->extraCharges->sum('provider_fee');
    }
}
