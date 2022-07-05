<?php

namespace App\Services\Report;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderItemStatus;
use App\Models\OrderStatus;
use App\Services\Report\Contracts\ReportableMonthly;
use App\Services\Report\Contracts\ReportableWeekly;
use App\Services\Report\Contracts\ReportableYearly;
use DateTime;
use Illuminate\Support\Facades\DB;

class StatsReportService implements ReportableWeekly, ReportableMonthly, ReportableYearly
{
    protected string $template = 'stats-report';

    public function getReportTitle(string $interval = 'weekly'): string
    {
        return ucwords($interval) . ' Stats Report.';
    }

    public function getTemplate(): string
    {
        return $this->template;
    }

    public function isEligibleToBeSentWeekly(): bool
    {
        return now()->isDayOfWeek('Monday');
    }

    public function isEligibleToBeSentMonthly(): bool
    {
        return now()->firstOfMonth()->isCurrentDay();
    }

    public function isEligibleToBeSentYearly(): bool
    {
        return true;

        return now()->firstOfYear()->isCurrentDay();
    }

    public function getReportData(DateTime $fromDate, DateTime $toDate): array
    {
        return [
            'Average order amount' => $this->getAvgOrderAmount($fromDate, $toDate),
            'Average number of cards graded by all customers' => $this->getAvgCardsGraded($fromDate, $toDate),
            'Number of repeat customers' => $this->getTotalRepeatCustomers($fromDate, $toDate),
            'Number of customers who order 25-50 cards' => $this->getCustomersWithCardsBetween($fromDate, $toDate, 25, 50),
            'Number of customers who order 50 - 100 cards' => $this->getCustomersWithCardsBetween($fromDate, $toDate, 50, 100),
            'Number of customers that order 100+ cards' => $this->getCustomersWithCardsBetween($fromDate, $toDate, 100),
            'Average number of days taken from confirmation to grading' => $this->getAvgDaysFromConfirmationTo($fromDate, $toDate, 'graded_at'),
            'Average number of days taken from confirmation to shipping' => $this->getAvgDaysFromConfirmationTo($fromDate, $toDate, 'shipped_at'),
            'Average number of days taken from grading to shipping' => $this->getAvgDaysFromGradingToShipping($fromDate, $toDate),
            'Average time from submission to payment' => $this->getAvgDaysFromSubmissionToPayment($fromDate, $toDate),
        ];
    }

    protected function getAvgOrderAmount(DateTime $fromDate, DateTime $toDate): int
    {
        return Order::betweenDates($fromDate, $toDate)->arePaid()->avg('grand_total') ?? 0;
    }

    protected function getAvgCardsGraded(DateTime $fromDate, DateTime $toDate): float|int
    {
        $totalCustomers = Order::join('order_items', 'order_items.order_id', '=', 'orders.id')
            ->whereBetween('order_items.created_at', [$fromDate, $toDate])
            ->where('order_item_status_id', OrderItemStatus::GRADED)
            ->groupBy('orders.user_id')
            ->count();

        if (! $totalCustomers) {
            return $totalCustomers;
        }

        return (OrderItem::betweenDates($fromDate, $toDate)->graded()->count() / $totalCustomers);
    }

    protected function getTotalRepeatCustomers(DateTime $fromDate, DateTime $toDate): int
    {
        return Order::groupBy('user_id')
            ->betweenDates($fromDate, $toDate)
            ->having(DB::raw('COUNT(user_id)'), '>', 1)
            ->count();
    }

    protected function getCustomersWithCardsBetween(DateTime $fromDate, DateTime $toDate, int $totalCardsGreaterThan, int $totalCardsLessThan = null): int
    {
        $query = Order::join('order_items', 'orders.id', '=', 'order_items.order_id')
            ->whereBetween('orders.created_at', [$fromDate, $toDate])
            ->groupBy('orders.user_id')
            ->having(DB::raw('COUNT(order_items.id)'), '>=', $totalCardsGreaterThan);

        if ($totalCardsLessThan) {
            $query = $query->having(DB::raw('COUNT(order_items.id)'), '<=', $totalCardsLessThan);
        }

        return count($query->get());
    }

    protected function getAvgDaysFromConfirmationTo(DateTime $fromDate, DateTime $toDate, string $statusOfOrder): int
    {
        $orderColumns = [
            'shipped_at' => OrderStatus::SHIPPED,
            'graded_at' => OrderStatus::GRADED,
        ];

        return Order::join('order_status_histories', 'order_status_histories.order_id', '=', 'orders.id')
                ->select(DB::raw("AVG(DATEDIFF(orders.$statusOfOrder, order_status_histories.created_at)) as avg"))
                ->where('orders.order_status_id', '=', $orderColumns[$statusOfOrder])
                ->where('order_status_histories.order_status_id', '=', OrderStatus::CONFIRMED)
                ->whereBetween('orders.created_at', [$fromDate, $toDate])
                ->first()
                ->avg ?? 0;
    }

    protected function getAvgDaysFromGradingToShipping(DateTime $fromDate, DateTime $toDate): int
    {
        return Order::select(DB::raw("AVG(DATEDIFF(graded_at, shipped_at)) as avg"))
                ->betweenDates($fromDate, $toDate)
                ->first()
                ->avg ?? 0;
    }

    protected function getAvgDaysFromSubmissionToPayment(DateTime $fromDate, DateTime $toDate): int
    {
        return Order::select(DB::raw("AVG(DATEDIFF(created_at, paid_at)) as avg"))
                ->betweenDates($fromDate, $toDate)
                ->first()
                ->avg ?? 0;
    }
}
