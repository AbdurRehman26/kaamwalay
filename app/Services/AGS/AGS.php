<?php

namespace App\Services\AGS;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;

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
