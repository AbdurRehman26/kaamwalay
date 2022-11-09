<?php

namespace App\Services\SalesmanCommission\OrderSalesmanCommission;

use App\Services\SalesmanCommission\OrderSalesmanCommission\Contracts\OrderFixedCommissionInterface;
use App\Services\SalesmanCommission\OrderSalesmanCommission\Contracts\OrderPercentageCommissionInterface;

class OrderCreateCommissionService implements OrderPercentageCommissionInterface, OrderFixedCommissionInterface
{
    use OrderCommissionTrait;
}
