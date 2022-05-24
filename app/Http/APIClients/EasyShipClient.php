<?php

namespace App\Http\APIClients;

use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;

class EasyShipClient
{
    protected string $baseUrl;
    protected string $apiKey;

    public function __construct()
    {
        $this->baseUrl = 'https://api.easyship.com/v2';
        $this->apiKey = config('services.easyship.key');
    }


    public function requestRates(array $originAddress, array $destinationAddress, string $incoterms, array $insurance, array $courierSelection, array $shippingSettings, array $parcels): Response
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
        \Log::debug($this->baseUrl . '/rates');
        \Log::debug(json_encode($data));
        return Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->apiKey,
        ])->post($this->baseUrl . '/rates', $data);
    }

}
