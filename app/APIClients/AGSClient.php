<?php

namespace App\APIClients;

use Illuminate\Http\Client\RequestException;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AGSClient
{
    protected const API_VERSION_1 = '/v1';
    protected const API_VERSION_2 = '/v2';

    public function baseUrl(): string
    {
        return config('services.ags.base_url');
    }

    public function v1(): string
    {
        return $this->baseUrl() . self::API_VERSION_1;
    }

    public function v2(): string
    {
        return $this->baseUrl() . self::API_VERSION_2;
    }

    public function login(array $data): array
    {
        $response = Http::post($this->baseUrl() . '/login/', $data);
        if ($response->successful()) {
            return $response->json();
        }

        return $this->responseHandler(response: $response, route: '/login/', payload: $data);
    }

    public function register(array $data): array
    {
        $response = Http::post(url: $this->baseUrl() . '/registration/', data: $data);
        if ($response->successful()) {
            return $response->json();
        }

        return $this->responseHandler(response: $response, route: '/registration/', payload: $data);
    }

    protected function responseHandler(Response $response, string $route, array $payload = []): array
    {
        try {
            $response->throw();
        } catch (RequestException $exception) {
            Log::error('Error occurred with AGS API', [
                'route' => $route,
                'message' => $exception->getMessage(),
                'payload' => $payload,
            ]);

            return [];
        }

        return [];
    }
}
