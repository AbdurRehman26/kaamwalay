<?php

namespace App\Services\ConfigurationService;

use Illuminate\Support\Facades\Cache;

class ConfigurationService
{
    public function getAllConfigurations(): array
    {
        $keys = config('configuration.keys');

        return $this->getConfigurationForKeys($keys);
    }

    private function getConfigurationForKeys(array $keys): array
    {
        if (! app()->environment('production')) {
            return $this->computeConfiguration($keys);
        }

        $tags = $this->cacheTags();
        $hash = $this->hashKeys($keys);

        return Cache::tags($tags)->remember($hash, env('CONFIGURATION_CACHE_TTL', 86400), function () use ($keys) {
            return $this->computeConfiguration($keys);
        });
    }

    private function computeConfiguration(array $keys): array
    {
        $config = [];

        foreach ($keys as $key => $value) {
            $configValue = $this->computeConfigKey($key, $value);
            if ($configValue->canBeInclude()) {
                $config[$configValue->getKey()] = $configValue->getValue();
            }
        }

        return $config;
    }

    private function cacheTags(): array
    {
        return ['configurations'];
    }

    public function invalidateConfigurations(): void
    {
        $tags = $this->cacheTags();
        $store = Cache::tags($tags);
        $store->clear();
    }

    private function computeConfigKey($key, $value): ConfigurationValue
    {
        $configValue = ConfigurationValue::from($value);
        if (! is_numeric($key)) {
            $configValue->setKey($key);
        }

        return $configValue;
    }

    private function hashKeys(array $keys): string
    {
        $suffix = auth()->check() ? 'with-auth' : '';
        return md5(implode(',', $keys) .'_'. $suffix);
    }
}
