<?php

namespace App\Listeners\API\Admin\Order;

use App\Events\API\Admin\Order\UnpaidOrderExtraCharge;
use App\Services\EmailService;

class UnpaidOrderExtraChargeListener
{
    public function __construct(protected EmailService $emailService)
    {
        //
    }

    public function handle(UnpaidOrderExtraCharge $event): void
    {
        //
    }
}
