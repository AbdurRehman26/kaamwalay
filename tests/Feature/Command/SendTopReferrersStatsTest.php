<?php

use App\Notifications\ReferralProgram\TopReferrersStatsNotification;
use Carbon\Carbon;
use Illuminate\Support\Facades\Notification;

it('sends top referrers stats daily', function () {
    Notification::fake();

    $this->artisan('referrer:send-top-referrers-stats ' . Carbon::now()->subDay()->format('Y-m-d'))
        ->assertExitCode(0);

    Notification::assertSentTimes(TopReferrersStatsNotification::class, 1);
})->skip(fn () => DB::getDriverName() !== 'mysql', 'Only runs when using mysql');