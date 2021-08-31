<?php

use App\Services\ConfigurationService\ConfigurationValue;
use Tests\TestCase;

uses(TestCase::class);

it('should correctly parse value', function () {
    $defaultConfigValue = new ConfigurationValue([
        "key" => "APP_ENV",
        "value" => env("APP_ENV"),
    ]);
    expect($defaultConfigValue->getKey())->toEqual('app_env');
    expect($defaultConfigValue->getValue())->toEqual(env('APP_ENV'));
    expect($defaultConfigValue->canBeInclude())->toEqual(true);

    $authConfigValue = new ConfigurationValue([
        "key" => "APP_ENV",
        "value" => env("APP_ENV"),
        "auth" => true,
    ]);
    expect($authConfigValue->getKey())->toEqual('app_env');
    expect($authConfigValue->getValue())->toEqual(null);
    expect($authConfigValue->canBeInclude())->toEqual(false);
});
