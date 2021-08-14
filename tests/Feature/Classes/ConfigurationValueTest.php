<?php

namespace Tests\Feature\Classes;

use App\Classes\ConfigurationValue\ConfigurationValue;
use Tests\TestCase;

class ConfigurationValueTest extends TestCase
{
    /** @test */
    public function it_should_correctly_parse_value()
    {
        $defaultConfigValue = new ConfigurationValue("APP_ENV");
        $this->assertEquals('app_env', $defaultConfigValue->getKey());
        $this->assertEquals(env('APP_ENV'), $defaultConfigValue->getValue());
        $this->assertEquals(true, $defaultConfigValue->canBeInclude());

        $envConfigValue = new ConfigurationValue("APP_ENV:env");
        $this->assertEquals('app_env', $envConfigValue->getKey());
        $this->assertEquals(env('APP_ENV'), $envConfigValue->getValue());
        $this->assertEquals(true, $envConfigValue->canBeInclude());

        $envNamedConfigValue = new ConfigurationValue("APP_ENV:env,environment");
        $this->assertEquals('environment', $envNamedConfigValue->getKey());
        $this->assertEquals(env('APP_ENV'), $envNamedConfigValue->getValue());
        $this->assertEquals(true, $envNamedConfigValue->canBeInclude());

        $authConfigValue = new ConfigurationValue("APP_ENV:auth");
        $this->assertEquals('app_env', $authConfigValue->getKey());
        $this->assertEquals(env('APP_ENV'), $authConfigValue->getValue());
        $this->assertEquals(false, $authConfigValue->canBeInclude());
    }
}
