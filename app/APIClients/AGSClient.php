<?php

namespace App\APIClients;

use Illuminate\Http\Client\RequestException;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AGSClient
{
    protected const API_VERSION_2 = '/v2';

    protected function getBaseUrl(): string
    {
        return config('services.ags.base_url');
    }

    protected function getAuthToken(): string
    {
        return config('services.ags.authorization_token');
    }

    public function login(array $data): array
    {
        $response = Http::post($this->getBaseUrl() . '/login/', $data);
        if ($response->successful()) {
            return $response->json();
        }

        return $this->responseHandler(response: $response, route: '/login/', payload: $data);
    }

    public function register(array $data): array
    {
        $response = Http::post(url: $this->getBaseUrl() . '/registration/', data: $data);
        if ($response->successful()) {
            return $response->json();
        }

        return $this->responseHandler(response: $response, route: '/registration/', payload: $data);
    }

    public function getGrades(array $data): array
    {
        $response = Http::withToken($this->getAuthToken())->get(url: $this->getBaseUrl() . self::API_VERSION_2 . '/robograding/scan-results/', query: $data);

        if ($response->successful()) {
            return $response->json();
        }

        return $this->responseHandler(response: $response, route: '/robograding/scan-results/', payload: $data);
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
