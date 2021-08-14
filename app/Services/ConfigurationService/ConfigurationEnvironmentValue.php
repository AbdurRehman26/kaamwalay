<?php

namespace App\Services\ConfigurationService;

class ConfigurationEnvironmentValue extends ConfigurationValueGetter
{
    private string $definedKey;

    public function __construct(string $definedKey = '')
    {
        $this->definedKey = $definedKey;
    }

    public function getValue(): mixed
    {
        return env($this->key);
    }

    public function getKey(): string
    {
        if (! $this->definedKey) {
            return parent::getKey();
        }

        return $this->keyName($this->definedKey);
    }
}
