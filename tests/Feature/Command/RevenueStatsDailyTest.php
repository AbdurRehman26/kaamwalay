<?php

use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

uses(TestCase::class);
uses(RefreshDatabase::class);

it('adds daily revenue stats', function () {
    Notification::fake();

    $this->artisan('revenue-stats:calculate-for-day ' . Carbon::now()->subDay(1)->format('Y-m-d'))
        ->assertExitCode(0);

    // Notification should not be sent because we are not running production
    Notification::assertNothingSent();
});
