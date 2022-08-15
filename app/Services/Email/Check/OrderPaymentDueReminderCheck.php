<?php

namespace App\Services\Email\Check;

use App\Models\Order;
use App\Models\ScheduledEmail;
use App\Services\Email\ReschedulingCheckInterface;
use App\Services\Email\ShouldStillSendCheckInterface;
use Carbon\Carbon;

class OrderPaymentDueReminderCheck implements ReschedulingCheckInterface, ShouldStillSendCheckInterface
{
    public function needsRescheduling(ScheduledEmail $scheduledEmail): bool
    {
        return $this->check($scheduledEmail);
    }

    public function getNextSendAt(ScheduledEmail $scheduledEmail): Carbon
    {
        return now()->addDays(2);
    }

    public function shouldStillSend(ScheduledEmail $scheduledEmail): bool
    {
        return $this->check($scheduledEmail);
    }

    protected function check(ScheduledEmail $scheduledEmail): bool
    {
        $extraData = unserialize($scheduledEmail->extra_data);
        $order = Order::find($extraData['order_id']);

        // Do not send payment reminder email if order is already paid
        if ($order->isPaid()) {
            return false;
        }

        // Do not send payment reminder email anymore if it's been more than 10 days
        // since order was graded
        if(now()->diff($order->graded_at)->days > 10) {
            return false;
        }

        return true;
    }
}
