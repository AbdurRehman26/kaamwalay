<?php

namespace App\Services\Email\Check;

use App\Models\ScheduledEmail;
use App\Models\User;
use App\Services\Email\ShouldStillSendCheckInterface;

class RegisteredUserMarketingEmailCampaignCheck implements ShouldStillSendCheckInterface
{
    public function shouldStillSend(ScheduledEmail $scheduledEmail): bool
    {
        $extraData = unserialize($scheduledEmail->extra_data);

        return User::find($extraData['user_id'])->orders()->placed()->count() === 0;
    }
}
