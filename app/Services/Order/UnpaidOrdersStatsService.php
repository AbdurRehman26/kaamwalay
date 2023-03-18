<?php

namespace App\Services\Order;

use App\Enums\Order\OrderPaymentStatusEnum;
use App\Models\Order;
use App\Models\OrderStatus;
use DateTime;
use Illuminate\Database\Eloquent\Builder;

class UnpaidOrdersStatsService
{
    public function calculateDailyStats(string $currentDate): array
    {
        $unpaidOrders = $this->dailyUnpaidOrders($currentDate)
            ->sum('grand_total');

        return [
            'unpaid_total' => $unpaidOrders,
            'date' => $currentDate,
            'total_orders' => $this->dailyOrdersCount($currentDate),
        ];
    }

    public function calculateDailyCardsTotal(): int
    {
        return $this->calculateCardsTotal(now()->subDays(1)->startOfDay(), now()->subDays(1)->endOfDay());
    }

    public function calculateMonthlyCardsTotal(): int
    {
        return $this->calculateCardsTotal(now()->subDays(1)->startOfMonth(), now()->subDays(1)->endOfMonth());
    }

    public function calculateCardsTotal(DateTime $startTime, DateTime $endTime): int
    {
        return Order::placed()->where('payment_status', '!=', OrderPaymentStatusEnum::PAID->value)
        ->join('order_items', 'order_items.order_id', '=', 'orders.id')->whereBetween('orders.created_at', [$startTime, $endTime])->sum('order_items.quantity');
    }

    public function calculateMonthlyStats(string $currentDate): array
    {
        $unpaidOrders = $this->monthlyUnpaidOrders($currentDate)
            ->sum('grand_total');

        return [
            'unpaid_total' => $unpaidOrders,
            'date' => $currentDate,
            'total_orders' => $this->monthlyOrdersCount($currentDate),
        ];
    }

    /**
     * @return Builder<Order>
    */
    protected function dailyUnpaidOrders(string $currentDate): Builder
    {
        return $this->orders()->forDate($currentDate);
    }

    /**
     * @return Builder<Order>
    */
    protected function monthlyUnpaidOrders(string $currentDate): Builder
    {
        return $this->orders()->forMonth($currentDate);
    }

    /**
     * @return Builder<Order>
     */
    protected function orders(): Builder
    {
        return Order::placed()->where('payment_status', '!=', OrderPaymentStatusEnum::PAID->value)->where(function (Builder $query) {
            $query->whereHas('orderCustomerShipment')->orWhere('order_status_id', OrderStatus::CONFIRMED);
        });
    }

    protected function dailyOrdersCount(string $currentDate): int
    {
        return $this->dailyUnpaidOrders($currentDate)->count();
    }

    protected function monthlyOrdersCount(string $currentDate): int
    {
        return $this->monthlyUnpaidOrders($currentDate)->count();
    }
}
