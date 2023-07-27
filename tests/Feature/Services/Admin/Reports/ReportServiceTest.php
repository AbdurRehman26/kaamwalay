<?php

use App\Contracts\Services\Admin\Reportable;
use App\Mail\Admin\ReportMail;
use App\Models\User;
use App\Services\Admin\Report\MarketingReport\MarketingMonthlyReport;
use App\Services\Admin\Report\MarketingReport\MarketingQuarterlyReport;
use App\Services\Admin\Report\MarketingReport\MarketingWeeklyReport;
use App\Services\Admin\Report\MarketingReport\MarketingYearlyReport;
use App\Services\Admin\Report\ReportsService;
use Carbon\Carbon;
use Database\Seeders\RolesSeeder;
use Illuminate\Support\Facades\Mail;
use function Pest\Laravel\seed;

beforeEach(function () {
    Mail::fake();
    Event::fake();
    seed(RolesSeeder::class);
    User::factory()->withRole(config('permission.roles.admin'))->create();

    $this->reports = [
        MarketingWeeklyReport::class,
        MarketingMonthlyReport::class,
        MarketingQuarterlyReport::class,
        MarketingYearlyReport::class,
    ];
    $this->reportService = resolve(ReportsService::class);
});

it('sends monthly, quarterly and yearly emails.', function () {
    /* selected date lies on 1st January Monday which means it's valid for monthly and quarterly */
    Carbon::setTestNow(Carbon::create(2024));

    $this->reportService->send();
    Mail::assertSent(ReportMail::class, 3);
})->skip(fn () => DB::getDriverName() !== 'mysql', 'Only runs when using mysql');

it('sends weekly emails.', function () {
    /* selected date lies on 6th January Saturday which means it's valid for weekly */
    Carbon::setTestNow(Carbon::create(2024, 1, 6));

    $this->reportService->send();
    Mail::assertSent(ReportMail::class, 1);
})->skip(fn () => DB::getDriverName() !== 'mysql', 'Only runs when using mysql');

it('checks if ReportService class has array of reports that have reportable implemented', function () {
    foreach ($this->reports as $report) {
        expect(resolve($report) instanceof Reportable)->toBeTrue();
    }
});

it('checks if quarterly report is eligible to be sent now.', function () {
    Carbon::setTestNow(Carbon::create(2022));
    $report = resolve(MarketingQuarterlyReport::class);
    expect($report->shouldSendNow())->toBeTrue();
});

it('checks if monthly report is eligible to be sent now.', function () {
    Carbon::setTestNow(Carbon::create('First day of this month'));
    $report = resolve(MarketingMonthlyReport::class);
    expect($report->shouldSendNow())->toBeTrue();
});

it('checks if weekly report is eligible to be sent now.', function () {
    Carbon::setTestNow(Carbon::create('First Saturday of 2022'));
    $report = resolve(MarketingWeeklyReport::class);
    expect($report->shouldSendNow())->toBeTrue();
});

it('checks if yearly report is eligible to be sent now.', function () {
    Carbon::setTestNow(Carbon::create('first day of January'));
    $report = resolve(MarketingYearlyReport::class);
    expect($report->shouldSendNow())->toBeTrue();
});

it('checks if report is sent to correct admins.', function () {
    Carbon::setTestNow(Carbon::create(2024));

    $this->reportService->send();

    Mail::assertSent(ReportMail::class, function ($mail) {
        return $mail->hasTo(User::admin()->pluck('email')->toArray());
    });
})->skip(fn () => DB::getDriverName() !== 'mysql', 'Only runs when using mysql');
