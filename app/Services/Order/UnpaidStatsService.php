<?php

namespace App\Services\Order;

use App\Enums\Order\OrderPaymentStatusEnum;
use App\Models\Order;

class UnpaidStatsService
{
    public function addDailyUnpaidStats(string $currentDate): array
    {
        $unpaidOrders = Order::where('payment_status', OrderPaymentStatusEnum::PENDING->value)
            ->orWhere('payment_status', OrderPaymentStatusEnum::DUE->value)
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
            ->orWhere('payment_status', OrderPaymentStatusEnum::DUE->value)
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
        ->orWhere('payment_status', OrderPaymentStatusEnum::DUE->value)
        ->forMonth($currentDate)
        ->count();
    }

    protected function dailyOrdersCount(string $currentDate): int
    {
        return Order::where('payment_status', OrderPaymentStatusEnum::PENDING->value)
        ->orWhere('payment_status', OrderPaymentStatusEnum::DUE->value)
        ->forDate($currentDate)
        ->count();
    }
}
