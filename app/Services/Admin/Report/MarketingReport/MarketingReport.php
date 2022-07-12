<?php

namespace App\Services\Admin\Report\MarketingReport;

use App\Contracts\Services\Admin\Reportable;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderItemStatus;
use App\Models\OrderStatus;
use App\Models\User;
use DateTime;
use Illuminate\Support\Facades\DB;

/**
 * On request of Alex Kegan (Marketing)
 */
abstract class MarketingReport implements Reportable
{
    public function getTemplate(): string
    {
        return 'marketing-report';
    }

    public function getDataForReport(DateTime $fromDate, DateTime $toDate): array
    {
        return [
            'Average order amount' => '$'.$this->getAvgOrderAmount($fromDate, $toDate),
            'Average number of cards graded by all customers' => $this->getAvgCardsGraded($fromDate, $toDate),
            'Number of repeat customers' => $this->getTotalRepeatCustomers($fromDate, $toDate),
            'Number of customers who order 25-50 cards' => $this->getCustomersWithCardsBetween($fromDate, $toDate, 25, 50),
            'Number of customers who order 50 - 100 cards' => $this->getCustomersWithCardsBetween($fromDate, $toDate, 50, 100),
            'Number of customers that order 100+ cards' => $this->getCustomersWithCardsBetween($fromDate, $toDate, 100),
            'Average number of days taken from confirmation to grading' => $this->getAvgDaysFromConfirmationTo($fromDate, $toDate, 'graded_at') . ' Day(s)',
            'Average number of days taken from confirmation to shipping' => $this->getAvgDaysFromConfirmationTo($fromDate, $toDate, 'shipped_at') . ' Day(s)',
            'Average number of days taken from grading to shipping' => $this->getAvgDaysFromGradingToShipping($fromDate, $toDate)  . ' Day(s)',
            'Average time from submission to payment' => $this->getAvgDaysFromSubmissionToPayment($fromDate, $toDate)  . ' Day(s)',
            'Average time from signup to submission' => $this->getAvgDaysFromSignupToSubmission($fromDate, $toDate)  . ' Day(s)',
            '% of signups that make submission' => $this->getPercentageOfSignupThatMadeSubmission($fromDate, $toDate),
            '% of submissions that don`t make payment' => $this->getPercentageOfSubmissionThatDontMakePayment($fromDate, $toDate),
        ];
    }

    protected function getAvgOrderAmount(DateTime $fromDate, DateTime $toDate): float
    {
        return (float) number_format(Order::paid()->betweenDates($fromDate, $toDate)->avg('grand_total'), 2);
    }

    protected function getAvgCardsGraded(DateTime $fromDate, DateTime $toDate): int
    {
        $totalCustomers = Order::whereBetween('graded_at', [$fromDate, $toDate])
                ->distinct('user_id')
                ->paid()
                ->where('order_status_id', '>=', OrderStatus::GRADED)
                ->count();

        if (! $totalCustomers) {
            return $totalCustomers;
        }

        return OrderItem::join('orders', 'orders.id', 'order_items.order_id')
                ->whereBetween('orders.graded_at', [$fromDate, $toDate])
                ->where('order_items.order_item_status_id', OrderItemStatus::GRADED)
                ->count() / $totalCustomers;
    }

    protected function getTotalRepeatCustomers(DateTime $fromDate, DateTime $toDate): int
    {
        return Order::select(DB::raw('MAX(user_id)'))
            ->paid()
            ->groupBy('user_id')
            ->betweenDates($fromDate, $toDate)
            ->having(DB::raw('COUNT(user_id)'), '>', 1)
            ->count();
    }

    protected function getCustomersWithCardsBetween(DateTime $fromDate, DateTime $toDate, int $totalCardsGreaterThan, int $totalCardsLessThan = null): int
    {
        $query = Order::selectRaw('MAX(orders.user_id)')
            ->join('order_items', 'orders.id', '=', 'order_items.order_id')
            ->whereBetween('orders.created_at', [$fromDate, $toDate])
            ->whereNotNull('orders.paid_at')
            ->groupBy('orders.user_id')
            ->having(DB::raw('COUNT(order_items.id)'), '>=', $totalCardsGreaterThan);

        if ($totalCardsLessThan) {
            $query = $query->having(DB::raw('COUNT(order_items.id)'), '<', $totalCardsLessThan);
        }

        return $query->count();
    }

    protected function getAvgDaysFromConfirmationTo(DateTime $fromDate, DateTime $toDate, string $statusOfOrder): int
    {
        $orderColumns = [
            'shipped_at' => OrderStatus::SHIPPED,
            'graded_at' => OrderStatus::GRADED,
        ];

        return Order::join('order_status_histories', 'order_status_histories.order_id', '=', 'orders.id')
                ->select(DB::raw("AVG(DATEDIFF(orders.$statusOfOrder, order_status_histories.created_at)) as avg"))
                ->where('orders.order_status_id', '>=', $orderColumns[$statusOfOrder])
                ->where('order_status_histories.order_status_id', '=', OrderStatus::CONFIRMED)
                ->whereBetween("orders.$statusOfOrder", [$fromDate, $toDate])
                ->first()
                ->avg ?? 0;
    }

    protected function getAvgDaysFromGradingToShipping(DateTime $fromDate, DateTime $toDate): int
    {
        return Order::select(DB::raw("AVG(DATEDIFF(shipped_at, graded_at)) as avg"))
                ->whereBetween('orders.shipped_at', [$fromDate, $toDate])
                ->first()
                ->avg ?? 0;
    }

    protected function getAvgDaysFromSubmissionToPayment(DateTime $fromDate, DateTime $toDate): int
    {
        return Order::select(DB::raw("AVG(DATEDIFF(paid_at, created_at)) as avg"))
                ->paid()
                ->betweenDates($fromDate, $toDate)
                ->first()
                ->avg ?? 0;
    }

    protected function getAvgDaysFromSignupToSubmission(DateTime $fromDate, DateTime $toDate): int
    {
        return User::select(DB::raw("AVG(DATEDIFF(orders.created_at, users.created_at)) as avg"))
                ->join('orders', 'orders.user_id', '=','users.id')
                ->whereBetween('users.created_at', [$fromDate, $toDate])
                ->first()->avg ?? 0;
    }

    protected function getPercentageOfSignupThatMadeSubmission(DateTime $fromDate, DateTime $toDate): float
    {
        $totalUsers = User::whereBetween('created_at', [$fromDate, $toDate])->count();

        if( !$totalUsers ){
            return $totalUsers;
        }

        return number_format(( User::whereHas('orders')
                    ->whereBetween('created_at', [$fromDate, $toDate])
                    ->count() /  $totalUsers) * 100, 2);
    }

    protected function getPercentageOfSubmissionThatDontMakePayment(DateTime $fromDate, DateTime $toDate): float
    {
        $totalOrders = Order::whereBetween('created_at', [$fromDate, $toDate])->count();

        if( !$totalOrders ){
            return $totalOrders;
        }

        return number_format( ( Order::whereNull('paid_at')->whereBetween('created_at', [$fromDate, $toDate])->count() /  $totalOrders) * 100 , 2);
    }
}
