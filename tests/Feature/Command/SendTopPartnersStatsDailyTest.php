<?php

use Carbon\Carbon;
use Illuminate\Support\Facades\Notification;

it('sends top partners stats daily', function () {
    Notification::fake();

    $this->artisan('referrer:top-referrers ' . Carbon::now()->subDay()->format('Y-m-d'))
        ->assertExitCode(0);
});
