<?php

namespace App\Services\Admin\V3;

use App\Models\Order;
use App\Models\ReferrerEarnedCommission;
use App\Models\User;
use App\Services\StatsService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Spatie\QueryBuilder\QueryBuilder;

class ReferralProgramService
{
    protected const PER_PAGE = 20;

    protected function getTotalOrders(string $startDate, string $endDate): int
    {
        return Order::paid()
            ->join('users', 'users.id', 'orders.user_id')
            ->whereNotNull('users.referred_by')
            ->whereBetween('orders.created_at', [$startDate, $endDate])
            ->count();
    }

    protected function getTotalSales(string $startDate, string $endDate): float
    {
        return Order::paid()
            ->join('users', 'users.id', 'orders.user_id')
            ->whereNotNull('users.referred_by')
            ->whereBetween('orders.created_at', [$startDate, $endDate])
            ->sum('grand_total');
    }

    protected function getTotalCards(string $startDate, string $endDate): int
    {
        return Order::paid()
            ->join('order_items', 'order_items.order_id', 'orders.id')
            ->join('users', 'users.id', 'orders.user_id')
            ->whereNotNull('users.referred_by')
            ->whereBetween('orders.created_at', [$startDate, $endDate])
            ->sum('order_items.quantity');
    }

    protected function getTotalEarnedCommission(string $startDate, string $endDate): float
    {
        return ReferrerEarnedCommission::join('orders', 'orders.id', 'referrer_earned_commissions.order_id')
            ->whereBetween('orders.created_at', [$startDate, $endDate])
            ->sum('commission');
    }
    
    public function getStat(array $data): float
    {
        $statsService = new StatsService();

        $startDate = $statsService->getStartDate($data['time_filter'], $data['start_date'] ?? '');
        $endDate = $statsService->getEndDate($data['time_filter'], $data['end_date'] ?? '');

        switch ($data['stat_name']) {
            case 'orders':
                return $this->getTotalOrders($startDate, $endDate);
            case 'sales':
                return $this->getTotalSales($startDate, $endDate);
            case 'cards':
                return $this->getTotalCards($startDate, $endDate);
            case 'commission_earned':
                return $this->getTotalEarnedCommission($startDate, $endDate);
           default:
                return 0;
        }
    }

    // @phpstan-ignore-next-line
    public function getReferees(): LengthAwarePaginator
    {
        return QueryBuilder::for(User::customer())
            ->whereNotNull('referred_by')
            ->allowedFilters(User::getAllowedAdminFilters())
            ->allowedSorts(User::getAllowedAdminSorts())
            ->defaultSort('-created_at')
            ->with('salesman')
            ->with('referredBy')
            ->paginate(request('per_page', self::PER_PAGE));
    }
}
