<?php

use Carbon\Carbon;
use Illuminate\Support\Facades\Notification;

it('adds monthly revenue stats', function () {
    Notification::fake();

    $this->artisan('revenue-stats:calculate-for-day ' . Carbon::parse(Carbon::now())->subDay(1)->format('F-Y'))
        ->assertExitCode(0);

    // Notification should not be sent because we are not running production
    Notification::assertNothingSent();
});
