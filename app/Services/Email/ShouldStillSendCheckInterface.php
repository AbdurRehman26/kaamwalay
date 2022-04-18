<?php

namespace App\Services\Email;

use App\Models\ScheduledEmail;

interface ShouldStillSendCheckInterface extends CheckInterface
{
    public function shouldStillSend(ScheduledEmail $scheduledEmail): bool;
}
