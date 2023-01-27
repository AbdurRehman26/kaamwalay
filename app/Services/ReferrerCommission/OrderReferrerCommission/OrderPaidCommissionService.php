<?php

namespace App\Services\ReferrerCommission\OrderReferrerCommission;

use App\Services\ReferrerCommission\OrderReferrerCommission\Contracts\OrderFixedCommissionInterface;
use App\Services\ReferrerCommission\OrderReferrerCommission\Contracts\OrderPercentageCommissionInterface;

class OrderPaidCommissionService implements OrderPercentageCommissionInterface, OrderFixedCommissionInterface
{
    use OrderCommissionTrait;
}
