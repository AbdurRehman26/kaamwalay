<?php

namespace App\Http\Resources\API\V1\Customer\Order;

use App\Http\Resources\API\BaseResource;
use App\Models\OrderPayment;

class OrderPaymentResource extends BaseResource
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

        if ($this->order->paymentMethod->code === 'paypal') {
            return $this->paypalData(json_decode($this->response, associative: true) ?? []);
        } elseif ($this->order->paymentMethod->isCollectorCoin()) {
            return $this->collectorCoinData(json_decode($this->response, associative: true) ?? []);
        }

        $hasCard = ! ($this->type === OrderPayment::TYPE_REFUND || $this->paymentMethod->isWallet());

        $card = null;

        if ($hasCard) {
            $providerResponse = json_decode($this->response);

            if (! empty($providerResponse->card)) {
                $card = $providerResponse->card;
            } else {
                //TODO ENABLE COLLECTOR COIN HERE
                $card = $providerResponse->charges->data[0]->payment_method_details->card;
            }
        }

        return [
            'id' => $this->id,
            'card' => $this->when($hasCard === true, [
                'brand' => $card?->brand,
                'exp_month' => $card?->exp_month,
                'exp_year' => $card?->exp_year,
                'last4' => $card?->last4,
            ]),
            'amount' => $this->amount,
            'notes' => $this->notes,
            'type' => $this->getPaymentType($this->type),
            'created_at' => $this->formatDate($this->created_at),
        ];
    }

    protected function paypalData(array $response): array
    {
        return [
            'payer' => [
                "email" => $response['payer']['email_address'] ?? "N/A",
                "name" => $response['payer']['name']['given_name'] ?? "N/A",
            ],
        ];
    }

    protected function collectorCoinData(array $response): array
    {
        return [
            'transaction' => [
                'amount' => $response['amount'],
                'hash' => substr($response['txn_hash'], 0, 5) . '...' . substr($response['txn_hash'], -4),
                'complete_hash' => $response['txn_hash'],
            ],
        ];
    }
}
