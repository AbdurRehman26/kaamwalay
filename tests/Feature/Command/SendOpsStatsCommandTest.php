<?php

use App\Notifications\OpsStatsNotification;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\DB;

it('sends OPS stats', function () {
    Notification::fake();

    $this->artisan("ops:send-stats", [
        'startDateTime' => Carbon::now()->subDay(),
        'endDateTime' => Carbon::now(),
    ])->assertExitCode(0);

    Notification::assertSentTimes(OpsStatsNotification::class, 1);
})->skip(fn () => DB::getDriverName() !== 'mysql', 'Only runs when using mysql');
