<?php

namespace App\Services\Email\ReschedulingCheck;

use App\Models\Order;
use App\Models\ScheduledEmail;
use App\Services\Email\RescheduleEmailCheckInterface;
use Carbon\Carbon;

class OrderPaymentDueReminder implements RescheduleEmailCheckInterface
{
    public function needsRescheduling(ScheduledEmail $scheduledEmail): bool
    {
        $payload = unserialize($scheduledEmail->payload);
        $order = Order::find($payload['extras']['order_id']);

        if ($order->isPaid()) {
            return false;
        }

        return true;
    }

    public function getNextSendAt(ScheduledEmail $scheduledEmail): Carbon
    {
        return now()->addDays(2);
    }
}
