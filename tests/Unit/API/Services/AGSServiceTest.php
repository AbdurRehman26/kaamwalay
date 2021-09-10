<?php

use App\Services\AGS\AgsService;

test('check if service is enabled', function () {
    config(['services.ags.is_platform_enabled' => true]);

    $ags = new AgsService();
    expect($ags->isEnabled())->toBeTrue();
})->group('services');
