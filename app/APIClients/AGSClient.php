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

    protected function baseUrl(): string
    {
        return config('services.ags.base_url');
    }

    protected function v1(): string
    {
        return $this->baseUrl() . self::API_VERSION_1;
    }

    protected function v2(): string
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

    protected function getAuthToken(): string
    {
        return config('services.ags.auth_token');
    }

    public function updateHumanGrades(string $certificateId, array $payload)
    {
        $response = Http::withToken($this->getAuthToken())
            ->patch($this->v2() . '/robograding/certificates/?certificate_id=' . $certificateId, $payload);
        if ($response->successful()) {
            return $response->json();
        }

        return $this->responseHandler(
            response: $response,
            route: '/robograding/certificates/',
            payload: ['data' => $payload, 'certificate_id' => $certificateId]
        );
    }

    public function createCertificates(string $certificateIds)
    {
        $response = Http::withToken($this->getAuthToken())->asForm()->post($this->v2() . '/robograding/certificates/', [
            "certificate_ids" => $certificateIds,
        ]);

        if ($response->successful()) {
            return $response->json();
        }

        return $this->responseHandler(response: $response, route: '/robograding/certificates/', payload: [$certificateIds]);
    }
}
