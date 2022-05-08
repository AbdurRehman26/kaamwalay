<?php

namespace App\Http\APIClients;

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

        return $this->handleErrorResponse(response: $response, route: '/login/', payload: $data);
    }

    public function register(array $data): array
    {
        $response = Http::post(url: $this->getBaseUrl() . '/registration/', data: $data);
        if ($response->successful()) {
            return $response->json();
        }

        return $this->handleErrorResponse(response: $response, route: '/registration/', payload: $data);
    }

    public function updateUserData(string $token, array $data): array
    {
        $response = Http::withToken($token)->patch(url: $this->getBaseUrl() . '/users/me/', data: $data);

        if ($response->successful()) {
            return $response->json();
        }

        return $this->handleErrorResponseWithCode(response: $response, route: '/users/me/', payload: $data);
    }

    public function changePassword(string $token, array $data): array
    {
        $response = Http::withToken($token)->post(url: $this->getBaseUrl() . '/password/change/', data: $data);

        if ($response->successful()) {
            return $response->json();
        }

        return $this->handleErrorResponseWithCode(response: $response, route: '/password/change/', payload: $data);
    }

    public function getGrades(array $data): array
    {
        $response = Http::withToken($this->getAuthToken())->get(url: $this->getBaseUrl() . self::API_VERSION_2 . '/robograding/scan-results/', query: $data);

        if ($response->successful()) {
            return $response->json();
        }

        return $this->handleErrorResponse(response: $response, route: '/robograding/scan-results/', payload: $data);
    }

    public function updateHumanGrades(string $certificateId, array $payload)
    {
        $response = Http::withToken($this->getAuthToken())
            ->patch($this->getBaseUrl() . self::API_VERSION_2 . '/robograding/certificates/?certificate_id=' . $certificateId, $payload);
        if ($response->successful()) {
            return $response->json();
        }

        return $this->handleErrorResponse(
            response: $response,
            route: '/robograding/certificates/',
            payload: ['data' => $payload, 'certificate_id' => $certificateId]
        );
    }

    public function createCertificates(array $data)
    {
        $response = Http::withToken($this->getAuthToken())->post($this->getBaseUrl() . self::API_VERSION_2 . '/robograding/certificates/', [
            "data" => $data,
        ]);

        if ($response->successful()) {
            return $response->json();
        }

        return $this->handleErrorResponse(response: $response, route: '/robograding/certificates/', payload: [$data]);
    }

    public function getCardSeries(array $data): array
    {
        $response = Http::withToken($this->getAuthToken())->get($this->getBaseUrl() . '/series/', $data);

        if ($response->successful()) {
            return $response->json();
        }

        return $this->handleErrorResponse(response: $response, route: '/series/', payload: [$data]);
    }

    public function createCardSeries(array $data): array
    {
        $response = Http::withToken($this->getAuthToken())->post($this->getBaseUrl() . '/series/', $data);

        if ($response->successful()) {
            return $response->json();
        }

        return $this->handleErrorResponse(response: $response, route: '/series/', payload: [$data]);
    }

    public function getCardSet(array $data): array
    {
        $response = Http::withToken($this->getAuthToken())->get($this->getBaseUrl() . '/sets/', $data);

        if ($response->successful()) {
            return $response->json();
        }

        return $this->handleErrorResponse(response: $response, route: '/sets/', payload: [$data]);
    }

    public function createCardSet(array $data): array
    {
        $response = Http::withToken($this->getAuthToken())->post($this->getBaseUrl() . '/sets/', $data);

        if ($response->successful()) {
            return $response->json();
        }

        return $this->handleErrorResponse(response: $response, route: '/sets/', payload: [$data]);
    }

    public function createCard(array $data): array
    {
        $response = Http::withToken($this->getAuthToken())->post($this->getBaseUrl() . '/cards/', $data);

        if ($response->successful()) {
            return $response->json();
        }

        return $this->handleErrorResponse(response: $response, route: '/cards/', payload: [$data]);
    }

    public function createCardLabel(array $data): array
    {
        $response = Http::withToken($this->getAuthToken())->post($this->getBaseUrl() . '/card-labels/', $data);

        if ($response->successful()) {
            return $response->json();
        }

        return $this->handleErrorResponse(response: $response, route: '/card-labels/', payload: [$data]);
    }

    protected function handleErrorResponse(Response $response, string $route, array $payload = []): array
    {
        unset($payload['password'], $payload['password1'], $payload['password2']);

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

    protected function handleErrorResponseWithCode(Response $response, string $route, array $payload = []): array
    {
        try {
            $response->throw();
        } catch (RequestException $exception) {
            Log::error('Error occurred with AGS API', [
                'route' => $route,
                'message' => $exception->getMessage(),
                'payload' => $payload,
            ]);

            return [
                'code' => $exception->getCode(),
                'message' => ! empty(json_decode($response->body())->app_message) ? json_decode($response->body())->app_message[0] : '',
            ];
        }

        return [];
    }

    public function deactivateAccount(string $token): array
    {
        $data = [
            'is_active' => false,
        ];

        $response = Http::withToken($token)->patch(url: $this->getBaseUrl() . '/users/me/', data:$data);

        if ($response->successful()) {
            return $response->json();
        }

        return $this->handleErrorResponseWithCode(response: $response, route: '/users/me/', payload: $data);
    }

    public function deleteAccount(string $token): array
    {
        $response = Http::withToken($token)->delete(url: $this->getBaseUrl() . '/users/me/');

        if ($response->successful()) {
            return $response->json();
        }

        return $this->handleErrorResponseWithCode(response: $response, route: '/users/me/');
    }
}
