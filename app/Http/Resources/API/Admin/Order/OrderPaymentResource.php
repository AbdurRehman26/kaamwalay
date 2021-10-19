<?php

namespace App\Http\Resources\API\Admin\Order;

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
            return $this->paypalData($this->response ?? []);
        }
        $hasCard = ! ($this->type === OrderPayment::PAYMENT_TYPES['refund']);

        $card = null;

        if ($hasCard) {
            $providerResponse = $this->response;

            if (! empty($providerResponse->card)) {
                $card = $providerResponse->card;
            } else {
                $card = $providerResponse->charges->data[0]->payment_method_details->card;
            }
        }

        return [
            'id' => $this->id,
            $this->when($hasCard === true, [
                'card' => [
                    'brand' => $card?->brand,
                    'exp_month' => $card?->exp_month,
                    'exp_year' => $card?->exp_year,
                    'last4' => $card?->last4,
                ],
            ]),
            'order_id' => $this->order_id,
            'amount' => $this->amount,
            'notes' => $this->notes,
            'type' => array_search($this->type, OrderPayment::PAYMENT_TYPES),
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
}
