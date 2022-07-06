<?php

use App\Mail\Admin\Report;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;

beforeEach(function () {
    Mail::fake();
    Event::fake();

    Config::set('mail.admin_addresses', [
        'test@gmail.com',
    ]);
});

it('sends monthly and quarterly emails sent to correct template', function () {
    $knownDate = Carbon::create(2023);
    Carbon::setTestNow($knownDate);

    $this->artisan('reports:send-email')
        ->assertExitCode(0);

    Mail::assertSent(function (Report $mail) {
        return  array_key_exists('name', $mail->templateInfo) && $mail->templateInfo['name'] === 'stats-report';
    });

    Mail::assertSent(Report::class, 2);

});


it('sends email for weekly', function () {
    $knownDate = Carbon::create(2022)->next('Monday');
    Carbon::setTestNow($knownDate);

    $this->artisan('reports:send-email')
        ->assertExitCode(0);

    Mail::assertSent(Report::class, 1);
});

