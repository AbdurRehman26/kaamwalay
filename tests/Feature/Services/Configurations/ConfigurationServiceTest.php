<?php

namespace Tests\Feature\Services\Configurations;

use App\Services\ConfigurationService\ConfigurationService;
use Tests\TestCase;

class ConfigurationServiceTest extends TestCase
{
    private ConfigurationService $configurationService;

    /** @test */
    public function it_should_instantiate_correctly()
    {
        $this->assertInstanceOf(ConfigurationService::class, $this->configurationService);
    }

    /** @test */
    public function it_should_get_guest_keys()
    {
        config([
            'configuration.keys' => [
                'APP_ENV' => [
                    'value' => env('APP_ENV'),
                    'auth' => false,
                ],
                'APP_URL' => [
                    'value' => env('APP_URL'),
                    'auth' => true,
                ],
            ],
        ]);

        $data = $this->configurationService->getAllConfigurations();
        $this->assertEquals([
            'app_env' => env('APP_ENV'),
        ], $data);
    }

    protected function setUp(): void
    {
        parent::setUp();
        $this->configurationService = $this->app->make(ConfigurationService::class);
    }
}