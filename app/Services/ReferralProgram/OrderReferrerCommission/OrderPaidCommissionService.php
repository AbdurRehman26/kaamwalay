<?php

namespace App\Services\ReferralProgram\OrderReferrerCommission;

use App\Services\ReferralProgram\OrderReferrerCommission\Contracts\OrderReferrerCommissionInterface;

class OrderPaidCommissionService implements OrderReferrerCommissionInterface
{
    use OrderCommissionTrait;
}
