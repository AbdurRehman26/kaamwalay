<?php

use Carbon\Carbon;
use Illuminate\Support\Facades\Notification;

it('sends daily unpaid orders stats', function () {
    Notification::fake();

    $this->artisan('unpaid-orders-stats:calculate-for-day', [
        'startDateTime' => Carbon::now()->subDay(),
        'endDateTime' => Carbon::now(),
    ])
        ->assertExitCode(0);
});
