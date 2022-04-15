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
        return $this->checkIfOrderIsPaid($scheduledEmail);
    }

    public function getNextSendAt(ScheduledEmail $scheduledEmail): Carbon
    {
        return now()->addDays(2);
    }

    public function shouldStillSend(ScheduledEmail $scheduledEmail): bool
    {
        return $this->checkIfOrderIsPaid($scheduledEmail);
    }

    protected function checkIfOrderIsPaid(ScheduledEmail $scheduledEmail): bool
    {
        $extraData = unserialize($scheduledEmail->extra_data);
        $order = Order::find($extraData['order_id']);

        if ($order->isPaid()) {
            return false;
        }

        return true;
    }
}
