<?php

namespace App\Services\Email\Check;

use App\Models\ScheduledEmail;
use App\Services\Email\ReschedulingCheckInterface;
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
        return now()->addDays(3);
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

        // Don't send if user referrers have paid order
        foreach($users as $user) {
            if ($user->orders()->paid()->count() > 0) {
                return false;
            }
        }

        return true;
    }
}
