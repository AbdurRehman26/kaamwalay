<?php

use Carbon\Carbon;
use Illuminate\Support\Facades\Notification;

it('adds daily revenue stats', function () {
    Notification::fake();

    $this->artisan('revenue-stats:calculate-for-day', [
        'startDateTime' => Carbon::now()->subDay(),
        'endDateTime' => Carbon::now(),
    ])
        ->assertExitCode(0);
});
