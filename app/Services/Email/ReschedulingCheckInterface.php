<?php

namespace App\Services\Email;

use App\Models\ScheduledEmail;
use Carbon\Carbon;

interface ReschedulingCheckInterface extends CheckInterface
{
    public function needsRescheduling(ScheduledEmail $scheduledEmail): bool;
    public function getNextSendAt(ScheduledEmail $scheduledEmail): Carbon;
}
