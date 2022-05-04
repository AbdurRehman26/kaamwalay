<?php

namespace App\Services\Order;

use App\Models\Order;
use App\Enums\Order\OrderPaymentStatusEnum;

class UnpaidStatsService
{
    public function addDailyUnpaidStats(string $currentDate): array
    {
        $unpaidOrders = Order::where('payment_status', OrderPaymentStatusEnum::PENDING->value)
            ->forDate($currentDate)
            ->sum('grand_total');

        return [
                'unpaidTotal' => $unpaidOrders,
                'Date' => $currentDate,
                'totalOrders' => $this->dailyOrdersCount($currentDate),
            ];
    }

    public function addMonthlyUnpaidStats(string $currentDate): array
    {
        $unpaidOrders = Order::where('payment_status', OrderPaymentStatusEnum::PENDING->value)
            ->forMonth($currentDate)
            ->sum('grand_total');

        return [
                'unpaidTotal' => $unpaidOrders,
                'Date' => $currentDate,
                'totalOrders' => $this->monthlyOrdersCount($currentDate),
            ];
    }

    protected function monthlyOrdersCount(string $currentDate): int 
    {
        return Order::where('payment_status', OrderPaymentStatusEnum::PENDING->value)
        ->forMonth($currentDate)
        ->count();
    }

    protected function dailyOrdersCount(string $currentDate): int 
    {
        return Order::where('payment_status', OrderPaymentStatusEnum::PENDING->value)
        ->forDate($currentDate)
        ->count();
    }
}
