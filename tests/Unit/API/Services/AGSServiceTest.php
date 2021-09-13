<?php

use App\Services\AGS\AgsService;

test('check if service is enabled', function () {
    config(['services.ags.is_platform_enabled' => true]);
    config(['services.ags.base_url' => 'https://example.com']);
    config(['services.ags.authorization_token' => '12345']);

    $ags = resolve(AgsService::class);
    expect($ags->isEnabled())->toBeTrue();
})->group('services');
