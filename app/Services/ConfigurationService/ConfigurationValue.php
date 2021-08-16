<?php

namespace App\Services\ConfigurationService;

use Illuminate\Support\Str;

class ConfigurationValue
{
    public function __construct(private array $options)
    {
        $this->options ??= [];
    }

    private function keyName($key): string
    {
        return Str::snake(Str::lower($key));
    }

    public function setKey(string $key): self
    {
        $this->options['key'] = $key;

        return $this;
    }

    public static function from($key, $value): self
    {
        return new ConfigurationValue(array_merge(['key' => $key], $value));
    }

    public function getKey(): string
    {
        return $this->keyName($this->options['key']);
    }

    public function getValue(): mixed
    {
        if (! $this->canBeInclude()) {
            return null;
        }

        return $this->options['value'] ?? null;
    }

    public function canBeInclude(): bool
    {
        $requireAuth = $this->options['auth'] ?? false;
        if ($requireAuth) {
            return auth()->check();
        }

        return true;
    }
}
