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

        return [
            'card' => [
                'brand' => $providerResponse->card->brand,
                'exp_month' => $providerResponse->card->exp_month,
                'exp_year' => $providerResponse->card->exp_year,
                'last4' => $providerResponse->card->last4,
            ],
        ];
    }
}
