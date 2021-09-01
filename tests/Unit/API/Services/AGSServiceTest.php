<?php

use App\Services\AGS\AGS;

test('check if service is enabled', function () {
    config(['services.ags.is_platform_enabled' => true]);
    $ags = new AGS();
    expect($ags->isEnabled())->toBeTrue();
})->group('services');
