<?php

use App\Console\Commands\SendAdminReports;
use App\Mail\Admin\ReportMail;
use App\Models\User;
use Carbon\Carbon;
use Database\Seeders\RolesSeeder;
use Illuminate\Support\Facades\Mail;

use function Pest\Laravel\seed;

beforeEach(function () {
    Mail::fake();
    Event::fake();
    seed(RolesSeeder::class);
    User::factory()->withRole(config('permission.roles.admin'))->create();
});

it('sends monthly and quarterly emails sent to correct template', function () {
    $knownDate = Carbon::create(2023);
    Carbon::setTestNow($knownDate);

    $this->artisan(SendAdminReports::class)
        ->assertExitCode(0);

    Mail::assertSent(function (ReportMail $mail) {
        return  array_key_exists('name', $mail->templateInfo) && $mail->templateInfo['name'] === 'marketing-report';
    });

    Mail::assertSent(ReportMail::class, 2);
});


it('sends email for weekly', function () {
    $knownDate = Carbon::create(2022)->next('Monday');
    Carbon::setTestNow($knownDate);

    $this->artisan(SendAdminReports::class)
        ->assertExitCode(0);

    Mail::assertSent(ReportMail::class, 1);
});
