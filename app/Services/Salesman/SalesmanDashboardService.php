<?php

namespace App\Services\Salesman;

use App\Models\Order;
use App\Models\User;

class SalesmanDashboardService
{
    public function getSales(User $salesman, array $data): float
    {
        $orderSalesQuery = Order::forSalesman($salesman);

        if($orderSalesQuery->exists()){
            if(!empty($data['filter']['from_date'])){
                $orderSalesQuery->where('created_at', '>=', $data['filter']['from_date']);
            }

            if(!empty($data['filter']['to_date'])){
                $orderSalesQuery->where('created_at', '<=', $data['filter']['to_date']);
            }
        }

        return $orderSalesQuery->sum('grand_total');
    }

    public function getCommissionsEarned(User $salesman, array $data): int
    {
        $orderCommissionQuery = Order::forSalesman($salesman);

        if($orderCommissionQuery->exists()){
            if(!empty($data['filter']['from_date'])){
                $orderCommissionQuery->where('created_at', '>=', $data['filter']['from_date']);
            }

            if(!empty($data['filter']['to_date'])){
                $orderCommissionQuery->where('created_at', '<=', $data['filter']['to_date']);
            }
        }

        return $orderCommissionQuery->sum('salesman_commission');
    }
}
