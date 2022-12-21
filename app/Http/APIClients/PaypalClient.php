<?php

namespace App\Http\APIClients;

use App\Models\Order;
use App\Models\OrderPayment;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use PayPalCheckoutSdk\Payments\CapturesRefundRequest;

class PaypalClient
{
    public function getInstance(): PendingRequest
    {
        return Http::baseUrl($this->baseUrl());
    }

    public function baseUrl()
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
            ->post('v1/oauth2/token', [
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
            ->withHeaders([
                'Prefer' => 'return=representation',
                'Content-Type' => 'application/json',
            ])
            ->post('v2/checkout/orders?', $data)
            ->throw()
            ->json();
    }

    /**
     * @throws RequestException
     */
    public function captureOrder(string $paypalOrderId)
    {
        return $this->getInstance()
            ->withToken($this->getAccessToken())
            ->withHeaders([
                'Prefer' => 'return=representation',
                'Content-Type' => 'application/json',
            ])
            ->post('v2/checkout/orders/' . $paypalOrderId . '/capture?')
            ->throw()
            ->json();
    }

    /**
     * @throws RequestException
     */
    public function captureRefund(string $paymentCaptureId, $refundData)
    {
        return $this->getInstance()
            ->withToken($this->getAccessToken())
            ->withHeaders([
                'Prefer' => 'return=representation',
                'Content-Type' => 'application/json',
            ])
            ->post('/v2/payments/captures/' . $paymentCaptureId . '/refund?', $refundData)
            ->throw()
            ->json();
    }

    protected function userAgent(): string
    {
        return "PayPalHttp-PHP HTTP/1.1";
    }
}
