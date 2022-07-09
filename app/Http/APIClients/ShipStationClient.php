<?php

namespace App\Http\APIClients;

use App\Models\Order;
use Exception;
use Http;

class ShipStationClient {

    public function createOrder(Order $order) {
        $data = [
            'orderNumber' => 'RG00001',
            'customerUsername' => 'Ali Raza',
            'customerEmail' => 'ali@wooter.com',
            'phone' => '8112114',
            'numberofCards' => 'RG00001',
            'orderDate' => '2015-06-29T08:46:27.0000000',
            'orderStatus' => 'awaiting_payment',
            'billTo' => [
                'name' => 'Home',
                'company' => null,
                'street1' => null,
                'street2' => null,
                'street3' => null,
                'city' => null,
                'state' => null,
                'postalCode' => null,
                'country' => null,
                'phone' => null,
                'residential' => null
            ],
            'shipTo' => [
                'name' => 'The Home',
                'company' => 'Wooter',
                'street1' => 'Muslimabad ',
                'street2' => 'G 10 3',
                'street3' => null,
                'city' => 'Abbottabad',
                'state' => '34',
                'postalCode' => '22010',
                'country' => 'US',
                'phone' => '8112113',
                'residential' => 'true'
            ]
        ];

        try {
            $response = Http::withBasicAuth(config('services.shipstation.api_key'), config('services.shipstation.api_secret'))->post(config('services.shipstation.base_url') . '/orders/createorder', $data);
            dd($response->json());
            return $response->json();
        } catch (Exception $e) {
            report($e);
        }
    }

}