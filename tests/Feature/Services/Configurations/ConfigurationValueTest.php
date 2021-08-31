<?php

use App\Services\ConfigurationService\ConfigurationValue;
use Tests\TestCase;

uses(TestCase::class);

it('should correctly parse value', function () {
    $defaultConfigValue = new ConfigurationValue([
        "key" => "APP_ENV",
        "value" => env("APP_ENV"),
    ]);
    $this->assertEquals('app_env', $defaultConfigValue->getKey());
    $this->assertEquals(env('APP_ENV'), $defaultConfigValue->getValue());
    $this->assertEquals(true, $defaultConfigValue->canBeInclude());

    $authConfigValue = new ConfigurationValue([
        "key" => "APP_ENV",
        "value" => env("APP_ENV"),
        "auth" => true,
    ]);
    $this->assertEquals('app_env', $authConfigValue->getKey());
    $this->assertEquals(null, $authConfigValue->getValue());
    $this->assertEquals(false, $authConfigValue->canBeInclude());
});
