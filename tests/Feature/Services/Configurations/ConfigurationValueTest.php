<?php

use App\Services\ConfigurationService\ConfigurationValue;

it('should correctly parse value', function () {
    $defaultConfigValue = new ConfigurationValue([
        'key' => 'APP_ENV',
        'value' => config('app.env'),
    ]);
    expect($defaultConfigValue->getKey())->toEqual('app_env');
    expect($defaultConfigValue->getValue())->toEqual(config('app.env'));
    expect($defaultConfigValue->canBeInclude())->toEqual(true);

    $authConfigValue = new ConfigurationValue([
        'key' => 'APP_ENV',
        'value' => config('app.env'),
        'auth' => true,
    ]);
    expect($authConfigValue->getKey())->toEqual('app_env');
    expect($authConfigValue->getValue())->toEqual(null);
    expect($authConfigValue->canBeInclude())->toEqual(false);
});
