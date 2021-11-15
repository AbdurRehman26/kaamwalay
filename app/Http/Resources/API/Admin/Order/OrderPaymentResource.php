<?php

namespace App\Http\Resources\API\Admin\Order;

use App\Http\Resources\API\BaseResource;
use App\Http\Resources\API\Customer\User\UserResource;
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
        }

        $hasCard = ! ($this->type === OrderPayment::TYPE_REFUND);

        $card = null;

        if ($hasCard) {
            $providerResponse = json_decode($this->response);

            if (! empty($providerResponse->card)) {
                $card = $providerResponse->card;
            } else {
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
            'user' => new UserResource($this->user),
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
}