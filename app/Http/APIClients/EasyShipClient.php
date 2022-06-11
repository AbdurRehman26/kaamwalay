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


    public function getRates(array $originAddress, array $destinationAddress, string $incoterms, array $insurance, array $courierSelection, array $shippingSettings, array $parcels): array
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
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
            ])->timeout(5)->retry(3, 500)
                ->post($this->baseUrl . '/rates', $data);

            return $response->json()['rates'];
        } catch (Exception $e) {
            Log::error('Request International Rates, User ID: ' . auth()->user()?->id);
            Log::error('EasyShip rates request:', $data);
            report($e);

            return [];
        }
    }
}
