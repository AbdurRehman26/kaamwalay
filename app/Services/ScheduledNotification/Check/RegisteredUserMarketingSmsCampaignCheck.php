<?php

namespace App\Services\ScheduledNotification\Check;

use App\Models\ScheduledNotification;
use App\Models\User;
use App\Services\ScheduledNotification\ShouldStillSendCheckInterface;

class RegisteredUserMarketingSmsCampaignCheck implements ShouldStillSendCheckInterface
{
    public function shouldStillSend(ScheduledNotification $scheduledNotification): bool
    {
        $user = User::find($scheduledNotification->notifiable_id);

        // User does not exist anymore
        if (! $user) {
            return false;
        }

        if (! $user->wantsToReceiveMarketingContent()) {
            return false;
        }

        return $user->phone && $user->orders()->placed()->doesntExist();
    }
}
