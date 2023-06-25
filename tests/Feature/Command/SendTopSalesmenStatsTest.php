<?php

use App\Notifications\Salesman\TopSalesmenStatsNotification;
use Carbon\Carbon;
use Illuminate\Support\Facades\Notification;

it('sends top salesmen stats daily', function () {
    Notification::fake();

    $this->artisan('salesman:send-top-salesmen-stats ' . Carbon::now()->subDay()->format('Y-m-d'))
        ->assertExitCode(0);

    Notification::assertSentTimes(TopSalesmenStatsNotification::class, 1);
})->skip(fn () => DB::getDriverName() !== 'mysql', 'Only runs when using mysql');
