<?php

namespace App\Http\APIClients;

use Exception;
use Http;
use Log;

class ShipStationClient
{
    public function createOrder(array $data): array
    {
        return $this->sendRequest('/orders/createorder', $data);
    }

    protected function sendRequest(string $url, array $data): array
    {
        try {
            $response = Http::baseUrl(config('services.shipstation.base_url'))->withBasicAuth(
                config('services.shipstation.api_key'),
                config('services.shipstation.api_secret')
            )->post($url, $data);

            return $response->json();
        } catch (Exception $e) {
            report($e);
            Log::error('Order could not be created on ShipStation: ' . $data['orderNumber'], [
                'message' => $e->getMessage(),
             ]);

            return [];
        }
    }
}
