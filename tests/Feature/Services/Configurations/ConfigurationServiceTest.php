<?php

use App\Services\ConfigurationService\ConfigurationService;
use Tests\TestCase;

uses(TestCase::class);

beforeEach(function () {
    $this->configurationService = $this->app->make(ConfigurationService::class);
});

it('should instantiate correctly', function () {
    $this->assertInstanceOf(ConfigurationService::class, $this->configurationService);
});

it('should get guest keys', function () {
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
});
