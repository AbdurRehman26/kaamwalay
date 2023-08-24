<?php

use App\Notifications\Salesman\SalesmenStatsNotification;
use Carbon\Carbon;
use Illuminate\Support\Facades\Notification;

it('sends salesmen stats daily', function () {
    Notification::fake();

    $this->artisan('salesman:send-salesmen-stats', [
        'date' => Carbon::now()->subDay()
    ])
        ->assertExitCode(0);

    Notification::assertSentTimes(SalesmenStatsNotification::class, 1);
})->skip(fn () => DB::getDriverName() !== 'mysql', 'Only runs when using mysql');
