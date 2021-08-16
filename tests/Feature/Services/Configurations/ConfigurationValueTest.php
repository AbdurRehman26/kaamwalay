<?php

namespace Tests\Feature\Services\Configurations;

use App\Services\ConfigurationService\ConfigurationValue;
use Tests\TestCase;

class ConfigurationValueTest extends TestCase
{
    /** @test */
    public function it_should_correctly_parse_value()
    {
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
    }
}
