<?php

namespace App\Services\ScheduledNotification;

use App\Models\ScheduledNotification;

interface ShouldStillSendCheckInterface
{
    public function shouldStillSend(ScheduledNotification $scheduledNotification): bool;
}
