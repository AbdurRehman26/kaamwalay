<?php

namespace App\Services\SalesmanCommission\OrderSalesmanCommission;

use App\Services\SalesmanCommission\OrderSalesmanCommission\Contracts\OrderFixedCommissionInterface;
use App\Services\SalesmanCommission\OrderSalesmanCommission\Contracts\OrderPercentageCommissionInterface;

class OrderCreateCommissionService implements OrderFixedCommissionInterface, OrderPercentageCommissionInterface
{
    use OrderCommissionTrait;
}
