<?php

use App\Services\AGS\AGS;
use Tests\TestCase;

uses(TestCase::class);

test('check if service is enabled', function () {
    config(['services.ags.is_platform_enabled' => true]);
    $ags = new AGS();
    $this->assertTrue($ags->isEnabled());
})->group('services');
