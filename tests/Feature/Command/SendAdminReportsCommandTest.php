<?php

use App\Console\Commands\SendAdminReports;
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

it('runs command to send reports to admins', function () {
    $knownDate = Carbon::create(2023);
    Carbon::setTestNow($knownDate);

    $this->artisan(SendAdminReports::class)
        ->assertExitCode(0);
})->skip(fn () => DB::getDriverName() !== 'mysql', 'Only runs when using mysql');
