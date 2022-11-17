<?php

namespace App\Services\Salesman;

use App\Models\Order;
use App\Models\User;
use Carbon\Carbon;

class SalesmanDashboardService
{
    public function getSales(User $salesman, array $data): float
    {
        $orderSalesQuery = Order::forSalesman($salesman);

        if ($orderSalesQuery->exists()) {
            if (! empty($data['filter']['from_date'])) {
                $orderSalesQuery->where('created_at', '>=', $data['filter']['from_date']);
            }

            if (! empty($data['filter']['to_date'])) {
                $orderSalesQuery->where('created_at', '<=', $data['filter']['to_date']);
            }
        }

        return $orderSalesQuery->sum('grand_total');
    }

    public function getCommissionsEarned(User $salesman, array $data = []): int
    {
        $orderCommissionQuery = Order::forSalesman($salesman);

        if ($orderCommissionQuery->exists()) {
            if (! empty($data['filter']['from_date'])) {
                $orderCommissionQuery->where('created_at', '>=', $data['filter']['from_date']);
            }

            if (! empty($data['filter']['to_date'])) {
                $orderCommissionQuery->where('created_at', '<=', $data['filter']['to_date']);
            }
        }

        return $orderCommissionQuery->sum('salesman_commission');
    }

    public function getStat(User $user, array $data): float
    {
        $now = Carbon::now();

        switch ($data['time_filter']) {
            case 'this_month':
                $startDate = $now->copy()->startOfMonth()->toDateString();
                $endDate = $now->copy()->endOfMonth()->toDateString();

                break;
            case 'last_month':
                $startDate = $now->copy()->subMonth()->startOfMonth()->toDateString();
                $endDate = $now->copy()->subMonth()->endOfMonth()->toDateString();

                break;
            case 'this_year':
                $startDate = $now->copy()->startOfYear()->toDateString();
                $endDate = $now->copy()->endOfYear()->toDateString();

                break;
            case 'last_year':
                $startDate = $now->copy()->subYear()->startOfYear()->toDateString();
                $endDate = $now->copy()->subYear()->endOfYear()->toDateString();

                break;
            case 'custom':
                $startDate = $data['start_date'];
                $endDate = $data['end_date'];

                break;
            default:
                return 0;
        }

        $startDate .= ' 00:00:00';
        $endDate .= ' 23:59:59';

        switch ($data['stat_name']) {
            case 'sales':
                return $user->salesmanOrders()->whereBetween('created_at', [$startDate, $endDate])->sum('grand_total');
            case 'commission_earned':
                return $user->salesmanProfile->salesmanEarnedCommissions()->whereBetween('created_at', [$startDate, $endDate])->sum('commission');
            case 'commission_paid':
                return $user->salesmanCommissionPayments()->whereBetween('created_at', [$startDate, $endDate])->sum('amount');
            case 'commission_unpaid': {
                $salesmanStatsService = resolve(SalesmanDashboardService::class);

                return $salesmanStatsService->getCommissionsEarned($user) - $user->receivedCommissionTotal();
            }
            default:
                return 0;
        }
    }
}
