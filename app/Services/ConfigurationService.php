<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class ConfigurationService
{
    public const STORE_GUEST = 'guest';
    public const STORE_AUTH = 'auth';
    private const KEY = "config";

    public function getAllConfigurations(): array
    {
        return array_merge($this->getGuestConfigurations(), $this->getAuthConfigurations());
    }

    public function getGuestConfigurations(): array
    {
        $keys = config('configuration.guest_environment_keys', []);

        return $this->getConfigurationForKeys(self::STORE_GUEST, $keys);
    }

    private function getConfigurationForKeys(string $name, array $keys): array
    {
        if (! app()->environment('production')) {
            return $this->computeConfiguration($keys);
        }

        $tags = $this->cacheTags($name);

        return Cache::tags($tags)->remember(self::KEY, 3600, function () use ($keys) {
            return $this->computeConfiguration($keys);
        });
    }

    private function computeConfiguration(array $keys)
    {
        $config = [];

        foreach ($keys as $key => $value) {
            if (is_numeric($key)) {
                $key = $value;
            }

            $key = Str::lower($key);
            $config[$key] = env($value);
        }

        return $config;
    }

    private function cacheTags(string $name): array
    {
        $tags = ['configurations'];
        if ($name && $name !== 'all') {
            $tags [] = $name;
        }

        return $tags;
    }

    public function getAuthConfigurations(): array
    {
        if (! auth()->check()) {
            return [];
        }

        $keys = config('configuration.auth_environment_keys', []);

        return $this->getConfigurationForKeys(self::STORE_AUTH, $keys);
    }

    public function invalidateConfigurations(string $name): void
    {
        $tags = $this->cacheTags($name);
        $store = Cache::tags($tags);

        if ($name === 'all') {
            $store->clear();
        } else {
            $store->forget(self::KEY);
        }
    }
}
