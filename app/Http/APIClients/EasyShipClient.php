<?php

namespace App\Http\APIClients;

use Exception;
use Illuminate\Support\Facades\Http;
use Log;

class EasyShipClient
{
    protected string $baseUrl;
    protected string $apiKey;

    public function __construct()
    {
        $this->baseUrl = 'https://api.easyship.com/v2';
        $this->apiKey = config('services.easyship.key');
    }


    public function requestRates(array $originAddress, array $destinationAddress, string $incoterms, array $insurance, array $courierSelection, array $shippingSettings, array $parcels): array
    {
        $data = [
            'origin_address' => $originAddress,
            'destination_address' => $destinationAddress,
            'incoterms' => $incoterms,
            'insurance' => $insurance,
            'courier_selection' => $courierSelection,
            'shipping_settings' => $shippingSettings,
            'parcels' => $parcels,
        ];

        try {
            Log::debug('EasyShip rates request:', $data);
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
//        ])->post($this->baseUrl . '/rates', $data);
            ])->timeout(5)->retry(3, 500)
                ->post($this->baseUrl . '/rates', $data);

            return (json_decode($response->body()))->rates;
        } catch (Exception $e) {
            report($e);

            return [];
        }
    }
}
