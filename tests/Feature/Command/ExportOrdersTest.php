<?php

namespace Tests\Feature\Command;

use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;
use Tests\TestCase;

class ExportOrdersTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_generates_export()
    {
        Excel::fake();
        Storage::fake('s3');

        $this->artisan('orders:export ' . Carbon::now()->format('Y-m-d'))
            ->assertExitCode(0);
    }
}
