<?php

namespace App\Classes\ConfigurationValue;

use Illuminate\Support\Str;

abstract class ConfigurationValueGetter
{
    protected string $key;

    abstract public function getValue(): mixed;

    public function getKey(): string
    {
        return $this->keyName($this->key);
    }

    public function setKey(string $key): void
    {
        $this->key = $key;
    }

    public function keyName($key): string
    {
        return Str::snake(Str::lower($key));
    }
}
