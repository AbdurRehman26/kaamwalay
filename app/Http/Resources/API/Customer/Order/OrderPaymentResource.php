<?php

namespace App\Http\Resources\API\Customer\Order;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderPaymentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $providerResponse = json_decode($this->response);

        if (is_null($providerResponse)) {
            return [];
        }

        if (! empty($providerResponse->card)) {
            $card = $providerResponse->card;
        } else {
            $card = $providerResponse->charges->data[0]->payment_method_details->card;
        }

        return [
            'card' => [
                'brand' => $card->brand,
                'exp_month' => $card->exp_month,
                'exp_year' => $card->exp_year,
                'last4' => $card->last4,
            ],
        ];
    }
}
