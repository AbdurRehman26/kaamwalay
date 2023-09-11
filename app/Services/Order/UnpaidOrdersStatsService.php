<?php

namespace App\Services\Order;

use App\Enums\Order\OrderPaymentStatusEnum;
use App\Models\Order;
use App\Models\OrderStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;

class UnpaidOrdersStatsService
{
    public function calculateDailyStats(Carbon $startDateTime, Carbon $endDateTime): array
    {
        $unpaidOrders = $this->dailyUnpaidOrders($startDateTime, $endDateTime)
            ->sum('grand_total');

        return [
            'unpaid_total' => $unpaidOrders,
            'date' => $startDateTime,
            'total_orders' => $this->dailyOrdersCount($startDateTime, $endDateTime),
        ];
    }

    public function calculateDailyCardsTotal(Carbon $startDateTime, Carbon $endDateTime): int
    {
        return $this->calculateCardsTotal($startDateTime, $endDateTime);
    }

    public function calculateMonthlyCardsTotal(Carbon $currentDate): int
    {
        $monthStart = Carbon::parse($currentDate)->firstOfMonth();
        $monthEnd = Carbon::parse($currentDate)->endOfMonth();

        return $this->calculateCardsTotal($monthStart, $monthEnd);
    }

    public function calculateCardsTotal(Carbon $startTime, Carbon $endTime): int
    {
        return Order::placed()->where('payment_status', '!=', OrderPaymentStatusEnum::PAID->value)
            ->join('order_items', 'order_items.order_id', '=', 'orders.id')->whereBetween('orders.created_at', [$startTime, $endTime])->where(function (Builder $query) {
                $query->whereHas('orderCustomerShipment')->orWhere('order_status_id', OrderStatus::CONFIRMED);
            })->sum('order_items.quantity');
    }

    public function calculateMonthlyStats(Carbon $currentDate): array
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
    protected function dailyUnpaidOrders(Carbon $startDateTime, Carbon $endDateTime): Builder
    {
        return $this->orders($startDateTime, $endDateTime);
    }

    /**
     * @return Builder<Order>
     */
    protected function monthlyUnpaidOrders(string $currentDate): Builder
    {
        $monthStart = Carbon::parse($currentDate)->firstOfMonth();
        $monthEnd = Carbon::parse($currentDate)->endOfMonth();

        return $this->orders($monthStart, $monthEnd);
    }

    /**
     * @return Builder<Order>
     */
    protected function orders(Carbon $startDateTime, Carbon $endDateTime): Builder
    {
        return Order::placed()->where('payment_status', '!=', OrderPaymentStatusEnum::PAID->value)->where(function (Builder $query) use ($startDateTime, $endDateTime) {
            $query->whereHas('orderCustomerShipment')->orWhere('order_status_id', OrderStatus::CONFIRMED)->whereBetween('created_at', [$startDateTime, $endDateTime]);
        });
    }

    protected function dailyOrdersCount(Carbon $startDateTime, Carbon $endDateTime): int
    {
        return $this->dailyUnpaidOrders($startDateTime, $endDateTime)->count();
    }

    protected function monthlyOrdersCount(string $currentDate): int
    {
        return $this->monthlyUnpaidOrders($currentDate)->count();
    }
}
