<?php

namespace App\Services\AGS;

use App\APIClients\AGSClient;
use JetBrains\PhpStorm\Pure;

class AgsService
{
    public function isEnabled(): bool
    {
        return (bool) config('services.ags.is_platform_enabled');
    }

    public function login(array $data): array
    {
        return $this->client()->login(data: $data);
    }

    public function register(array $data): array
    {
        return $this->client()->register(data: $data);
    }

    #[Pure]
    public function client(): AGSClient
    {
        return new AGSClient();
    }
}
