<?php

namespace App\Http\APIClients;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;

class PaypalClient
{
    public function getInstance(): PendingRequest
    {
        return Http::baseUrl($this->baseUrl())->withUserAgent($this->userAgent());
    }

    public function baseUrl(): string
    {
        return config('services.paypal.base_url');
    }

    /**
     * @throws RequestException
     */
    protected function getAccessToken(): string
    {
        $response = $this->getInstance()->withBasicAuth(
            config('services.paypal.client_id'),
            config('services.paypal.client_secret'),
        )
            ->asForm()
            ->post('/v1/oauth2/token', [
                'grant_type' => 'client_credentials',
            ])
            ->throw()
            ->json();

        return $response['access_token'];
    }

    /**
     * @throws RequestException
     */
    public function createOrder(array $data): array
    {
        return $this->getInstance()->withToken($this->getAccessToken())
            ->withHeaders($this->headers())
            ->post('/v2/checkout/orders?', $data)
            ->throw()
            ->json();
    }

    /**
     * @throws RequestException
     */
    public function captureOrder(string $paypalOrderId): array
    {
        return $this->getInstance()
            ->withToken($this->getAccessToken())
            ->withHeaders($this->headers())
            ->post('/v2/checkout/orders/' . $paypalOrderId . '/capture?', [
                // This is required, without this, the API was not working.
                'application_context' => [
                    'return_url' => '',
                    'cancel_url' => '',
                ],
            ])
            ->throw()
            ->json();
    }

    /**
     * @throws RequestException
     */
    public function captureRefund(string $paymentCaptureId, array $refundData): array
    {
        return $this->getInstance()
            ->withToken($this->getAccessToken())
            ->withHeaders($this->headers())
            ->post('/v2/payments/captures/' . $paymentCaptureId . '/refund?', $refundData)
            ->throw()
            ->json();
    }

    /**
     * @throws RequestException
     */
    public function createBatchPayout(array $data): array
    {
        return $this->getInstance()->withToken($this->getAccessToken())
            ->withHeaders($this->headers())
            ->post('/v1/payments/payouts?', $data)
            ->throw()
            ->json();
    }

    /**
     * @throws RequestException
     */
    public function getBatchPayoutStatus(string $payoutBatchId): array
    {
        return $this->getInstance()->withToken($this->getAccessToken())
            ->withHeaders($this->headers())
            ->get('/v1/payments/payouts/'. $payoutBatchId)
            ->throw()
            ->json();
    }
    protected function userAgent(): string
    {
        return "RG-PHP HTTP/1.1";
    }

    protected function headers(): array
    {
        return [
            'Prefer' => 'return=representation',
            'Content-Type' => 'application/json',
        ];
    }
}
