<?php

use Carbon\Carbon;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;

it('generates export', function () {
    Excel::fake();
    Storage::fake('s3');
    Notification::fake();

    $this->artisan('orders:export ' . Carbon::now()->format('Y-m-d'))
        ->assertExitCode(0);
});
