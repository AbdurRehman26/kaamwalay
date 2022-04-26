<?php

namespace App\Http\Resources\API\V2\Admin\VaultShipment;

use App\Http\Resources\API\BaseResource;

/**
 * @property mixed $id
 * @property mixed $response
 * @property mixed $paymentMethod
 * @property mixed $updated_at
 */

class VaultShipmentPaymentResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        if (! $this->response) {
            return [];
        }

        $response = [];

        if ($this->paymentMethod->code === 'paypal') {
            $response = $this->paypalData(json_decode($this->response, associative: true) ?? []);
        } elseif($this->paymentMethod->code === 'stripe'){
          $response = $this->stripeData($this->response);
        } elseif($this->paymentMethod->isCollectorCoin()){
            $response = $this->collectorCoinData(json_decode($this->response, associative: true) ?? []);
        }

        return $response;
    }

    protected function paypalData(array $response): array
    {
        return [
            'charged_on' => $this->formatDate($this->updated_at),
            'payer' => [
                "email" => $response['payer']['email_address'] ?? "N/A",
                "name" => $response['payer']['name']['given_name'] ?? "N/A",
            ],
        ];
    }

    protected function stripeData(string $response): array
    {
        $providerResponse = json_decode($response);
        $card = $providerResponse->charges->data[0]->payment_method_details->card;
        return [
            'id' => $this->id,
            'charged_on' => $this->formatDate($this->updated_at),
            'card' => [
                'brand' => $card?->brand,
                'exp_month' => $card?->exp_month,
                'exp_year' => $card?->exp_year,
                'last4' => $card?->last4,
            ]
        ];
    }
    
    protected function collectorCoinData(array $response): array
    {
        return [
            'charged_on' => $this->formatDate($this->updated_at),
            'transaction' => [
                'amount' => $response['amount'],
                'hash' => substr($response['txn_hash'], 0, 5) . '...' . substr($response['txn_hash'], -4),
                'complete_hash' => $response['txn_hash'],
            ],
        ];
    }
}
