<?php

namespace Tests\Feature\Command;

use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class RevenueStatsDailyTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_adds_daily_revenue_stats()
    {
        Notification::fake();

        $this->artisan('revenue-stats:calculate-for-day ' . Carbon::now()->subDay(1)->format('Y-m-d'))
            ->assertExitCode(0);

        // Notification should not be sent because we are not running production
        Notification::assertNothingSent();
    }
}
