<?php

namespace App\Listeners\API\Admin\Order;

use App\Events\API\Admin\Order\UnpaidOrderRefund;
use App\Services\EmailService;

class UnpaidOrderRefundListener
{
    public function __construct(protected EmailService $emailService)
    {
        //
    }

    public function handle(UnpaidOrderRefund $event)
    {
        //
    }
}
