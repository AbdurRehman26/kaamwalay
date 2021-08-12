<?php

namespace Tests\Unit\API\Services;

use App\Services\AGS\AGS;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Tests\TestCase;

class AGSServiceTest extends TestCase
{
    /**
     * @test
     * @group services
     */
    public function ensure_ags_service_is_up()
    {
        $response = Http::get(Str::replace('/api/', '', config('services.ags.base_url')));
        $this->assertTrue($response->status() === 200);
    }
}
