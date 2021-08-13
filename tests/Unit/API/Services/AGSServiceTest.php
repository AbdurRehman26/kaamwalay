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
    public function check_if_service_is_enabled()
    {
        config(['services.ags.is_platform_enabled' => true]);
        $ags = new AGS();
        $this->assertTrue($ags->isEnabled());
    }
}
