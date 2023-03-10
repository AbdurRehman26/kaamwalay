<?php

namespace App\Services\Email\Check;

use App\Models\Order;
use App\Models\ScheduledEmail;
use App\Services\Email\ReschedulingCheckInterface;
use Illuminate\Support\Facades\Log;
use App\Services\Email\ShouldStillSendCheckInterface;
use Carbon\Carbon;

class CreateReferrerReminderCheck implements ReschedulingCheckInterface, ShouldStillSendCheckInterface
{
    public function needsRescheduling(ScheduledEmail $scheduledEmail): bool
    {
        return $this->check($scheduledEmail);
    }

    public function getNextSendAt(ScheduledEmail $scheduledEmail): Carbon
    {
        return now()->addMinutes(3);
    }

    public function shouldStillSend(ScheduledEmail $scheduledEmail): bool
    {
        return $this->check($scheduledEmail);
    }

    protected function check(ScheduledEmail $scheduledEmail): bool
    {
        $extraData = unserialize($scheduledEmail->extra_data);
        $users = $extraData['user']->referees;

        // Send Remainder if user has no referees
        if (count($users) === 0) {
            return true;
        }

        foreach($users as $user) {
            $paidOrder = $user->orders()->paid()->count() > 0; 
            Log::info("Paid order count !!! : ". $paidOrder);
            return false;
        }
        

        // return true;
    }
}
