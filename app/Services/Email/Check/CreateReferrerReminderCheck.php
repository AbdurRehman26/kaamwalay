<?php

namespace App\Services\Email\Check;

use App\Models\ScheduledEmail;
use App\Models\User;
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
        $user = User::find($extraData['user_id']);

        if (! $user) {
            return false;
        }
    
        $referees = $user->referees;

        // Send Remainder if user has no referees
        if (count($referees) === 0) {
            return true;
        }

        // Don't send if user referrers have paid order
        foreach ($referees as $referee) {
            if ($referee->orders()->paid()->count() > 0) {
                return false;
            }
        }

        return true;
    }
}
