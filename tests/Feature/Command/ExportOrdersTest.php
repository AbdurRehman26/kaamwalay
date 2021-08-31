<?php

use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;
use Tests\TestCase;

uses(TestCase::class);
uses(RefreshDatabase::class);

it('generates export', function () {
    Excel::fake();
    Storage::fake('s3');
    Notification::fake();

    $this->artisan('orders:export ' . Carbon::now()->format('Y-m-d'))
        ->assertExitCode(0);

    // Notification should not be sent because we are not running production
    Notification::assertNothingSent();
});
