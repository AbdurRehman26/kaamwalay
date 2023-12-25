<?php

namespace App\Services\Email\Check;

use App\Models\ScheduledEmail;
use App\Models\User;
use App\Services\Email\ShouldStillSendCheckInterface;

class CreateReferrerReminderCheck implements ShouldStillSendCheckInterface
{
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

        if (! $user->wantsToReceiveMarketingContent()) {
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
