<?php

use Carbon\Carbon;
use Illuminate\Support\Facades\Notification;

it('adds daily unpaid stats', function () {
    Notification::fake();

    $this->artisan('unpaid-stats:calculate-for-day ' . Carbon::now()->subDay(1)->format('Y-m-d'))
        ->assertExitCode(0);
});
