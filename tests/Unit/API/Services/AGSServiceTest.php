<?php

namespace Tests\Unit\API\Services;

use App\Services\AGS\AGS;
use Tests\TestCase;

class AGSServiceTest extends TestCase
{
    /**
     * @test
     * @group services
     */
    public function base_url_is_defined_when_services_is_enabled()
    {
        $ags = new AGS();
        if (! $ags->isEnabled()) {
            $this->markTestSkipped('AGS platform is not enabled.');
        }
        $this->assertTrue(! ! config('services.ags.base_url'));
    }
}
