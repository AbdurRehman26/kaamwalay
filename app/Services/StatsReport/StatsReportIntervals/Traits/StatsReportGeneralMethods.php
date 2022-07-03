<?php

namespace App\Services\StatsReport\StatsReportIntervals\Traits;

use Illuminate\Support\Facades\DB;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderItemStatus;
use App\Models\OrderStatus;

trait StatsReportGeneralMethods
{
    public function getReportData(string $fromDate, string $toDate): array
    {
        return [
            'AVG_ORDER_AMOUNT' =>  $this->getAvgOrderAmount($fromDate, $toDate),
            'AVG_CARDS_GRADED' => $this->getAvgCardsGraded($fromDate, $toDate),
            'REPEAT_CUSTOMERS' => $this->getTotalRepeatCustomers($fromDate, $toDate),
            'CUSTOMER_WITH_25_50_CARDS' => $this->getCustomersWithCardsBetween($fromDate, $toDate, 25, 50),
            'CUSTOMER_WITH_50_100_CARDS' => $this->getCustomersWithCardsBetween($fromDate, $toDate, 50, 100),
            'CUSTOMER_WITH_MORE_THAN_100_CARDS' => $this->getCustomersWithCardsBetween($fromDate, $toDate, 100),
            'AVG_DAYS_FROM_CONFIRMATION_TO_GRADING' => $this->getAvgDaysFromConfirmationTo($fromDate, $toDate, 'graded_at'),
            'AVG_DAYS_FROM_CONFIRMATION_TO_SHIPPING' => $this->getAvgDaysFromConfirmationTo($fromDate, $toDate, 'shipped_at'),
            'AVG_DAYS_FROM_GRADING_TO_SHIPPING' => $this->getAvgDaysFromGradingToShipping($fromDate, $toDate),
        ];
    }

    private function getAvgOrderAmount(string $fromDate, string $toDate): int
    {
        return Order::betweenDates($fromDate, $toDate)->arePaid()->avg('grand_total') ?? 0;
    }

    private function getAvgCardsGraded(string $fromDate, string $toDate): float|int
    {
        $totalCustomers = Order::join('order_items', 'order_items.order_id', '=', 'orders.id')
            ->whereBetween('order_items.created_at', [$fromDate, $toDate])
            ->where('order_item_status_id', OrderItemStatus::GRADED)
            ->groupBy('orders.user_id')
            ->count();

        if(!$totalCustomers){
            return $totalCustomers;
        }

        return ( OrderItem::betweenDates($fromDate, $toDate)->graded()->count() / $totalCustomers );
    }

    private function getTotalRepeatCustomers(string $fromDate, string $toDate): int
    {
        return Order::groupBy('user_id')
            ->betweenDates($fromDate, $toDate)
            ->having(DB::raw('COUNT(user_id)'),'>' ,1)
            ->count();
    }

    private function getCustomersWithCardsBetween(string $fromDate, string $toDate, int $totalCardsGreaterThan, int $totalCardsLessThan = null): int
    {
        $query = Order::join('order_items', 'orders.id', '=', 'order_items.order_id')
            ->whereBetween('orders.created_at', [$fromDate, $toDate])
            ->groupBy('orders.user_id')
            ->having(DB::raw('COUNT(order_items.id)'), '>=', $totalCardsGreaterThan);

        if($totalCardsLessThan){
            $query = $query->having(DB::raw('COUNT(order_items.id)'), '<=', $totalCardsLessThan);
        }

        return count($query->get());
    }

    protected function getAvgDaysFromConfirmationTo(string $fromDate, string $toDate, string $statusOfOrder): int
    {
        $orderColumns = [
            'shipped_at' => OrderStatus::SHIPPED,
            'graded_at' => OrderStatus::GRADED
        ];

        return Order::join('order_status_histories', 'order_status_histories.order_id', '=', 'orders.id')
                ->select(DB::raw("AVG(DATEDIFF(orders.$statusOfOrder, order_status_histories.created_at)) as avg"))
                ->where('orders.order_status_id', '=', $orderColumns[$statusOfOrder])
                ->where('order_status_histories.order_status_id', '=', OrderStatus::CONFIRMED)
                ->whereBetween('orders.created_at', [$fromDate, $toDate])
                ->first()
                ->avg ?? 0;
    }

    public function getAvgDaysFromGradingToShipping(string $fromDate, string $toDate): int
    {

        return Order::select(DB::raw("AVG(DATEDIFF(graded_at, shipped_at)) as avg"))
                ->betweenDates($fromDate, $toDate)
                ->first()
                ->avg ?? 0;

    }
}
