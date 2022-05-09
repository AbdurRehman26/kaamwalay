<?php

namespace App\Services\Order;

use App\Enums\Order\OrderPaymentStatusEnum;
use App\Models\Order;
use Illuminate\Database\Eloquent\Builder;

class UnpaidOrdersStatsService
{
    public function calculateDailyStats(string $currentDate): array
    {
        $unpaidOrders = $this->dailyUnpaidOrders($currentDate)
            ->sum('grand_total');

        return [
            'unpaidTotal' => $unpaidOrders,
            'date' => $currentDate,
            'totalOrders' => $this->dailyOrdersCount($currentDate),
        ];
    }

    public function calculateMonthlyStats(string $currentDate): array
    {
        $unpaidOrders = $this->monthlyUnpaidOrders($currentDate)
            ->sum('grand_total');

        return [
            'unpaidTotal' => $unpaidOrders,
            'date' => $currentDate,
            'totalOrders' => $this->monthlyOrdersCount($currentDate),
        ];
    }

    /**
     * @return Builder<Order>
    */
    public function dailyUnpaidOrders(string $currentDate): Builder
    {
        return Order::where('payment_status', '!=', OrderPaymentStatusEnum::PAID->value)
            ->forDate($currentDate);
    }

    /**
     * @return Builder<Order>
    */
    public function monthlyUnpaidOrders(string $currentDate): Builder
    {
        return Order::where('payment_status', '!=', OrderPaymentStatusEnum::PAID->value)
            ->forMonth($currentDate);
    }

    protected function monthlyOrdersCount(string $currentDate): int
    {
        return $this->monthlyUnpaidOrders($currentDate)
            ->count();
    }

    protected function dailyOrdersCount(string $currentDate): int
    {
        return $this->dailyUnpaidOrders($currentDate)
            ->count();
    }
}
