<?php

use Carbon\Carbon;
use Illuminate\Support\Facades\Notification;

it('sends daily unpaid orders stats', function () {
    Notification::fake();

    $this->artisan('unpaid-orders-stats:calculate-for-day ' . Carbon::now()->subDay(1)->format('Y-m-d'))
        ->assertExitCode(0);
});
