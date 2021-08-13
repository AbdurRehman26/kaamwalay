<?php

namespace App\Services\AGS;

class AGS
{
    public function isEnabled(): bool
    {
        return (bool) config('services.ags.is_platform_enabled');
    }

    public function baseUrl(): string
    {
        return config('services.ags.base_url');
    }
}
