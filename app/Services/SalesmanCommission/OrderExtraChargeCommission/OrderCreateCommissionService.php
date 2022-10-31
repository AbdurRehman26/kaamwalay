<?php

namespace App\Services\SalesmanCommission\OrderExtraChargeCommission;

use App\Models\Order;
use App\Services\SalesmanCommission\OrderExtraChargeCommission\Contracts\OrderFixedCommissionInterface;
use App\Services\SalesmanCommission\OrderExtraChargeCommission\Contracts\OrderPercentageCommissionInterface;

class OrderCreateCommissionService implements OrderPercentageCommissionInterface, OrderFixedCommissionInterface
{
    use OrderCommissionTrait;
}
