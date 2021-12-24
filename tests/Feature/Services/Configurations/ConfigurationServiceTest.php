<?php

use App\Services\ConfigurationService\ConfigurationService;

beforeEach(function () {
    $this->configurationService = $this->app->make(ConfigurationService::class);
});

it('should instantiate correctly', function () {
    expect($this->configurationService)->toBeInstanceOf(ConfigurationService::class);
});

it('should get guest keys', function () {
    config([
        'configuration.keys' => [
            'APP_ENV' => [
                'value' => config('app.env'),
                'auth' => false,
            ],
            'APP_URL' => [
                'value' => config('app.env'),
                'auth' => true,
            ],
        ],
    ]);

    $data = $this->configurationService->getAllConfigurations();
    $this->assertEquals([
        'app_env' => config('app.env'),
    ], $data);
});
