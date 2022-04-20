<?php

namespace App\Http\Resources\API\V2\Admin\VaultShipment;

use App\Http\Resources\API\BaseResource;
use App\Http\Resources\API\V2\Admin\Order\OrderCustomerResource;
use App\Http\Resources\API\V2\Customer\Order\OrderAddressResource;
use App\Http\Resources\API\V2\Customer\Order\ShippingMethod\ShippingMethodResource;

/**
 * @property mixed $id
 * @property mixed $shipment_number
 * @property mixed $created_at
 * @property mixed $shipped_at
 * @property mixed $tracking_number
 * @property mixed $shipping_provider
 * @property mixed $tracking_url
 * @method vaultShipmentItems()
 */
class VaultShipmentResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $payments = $this->vaultShipmentPayments->map(function ($item) {
            if($item->paymentMethod->code === 'paypal') {
                return $this->paypalData(json_decode($item->response, associative: true) ?? []);
            } elseif($item->paymentMethod->code === 'stripe'){
                return $this->stripeData($item->response);
            } elseif($item->paymentMethod->isCollectorCoin()){
                return $this->collectorCoinData(json_decode($item->response, associative: true) ?? []);
            }
        });

        return [
            'id' => $this->id,
            'shipment_number' => $this->shipment_number,
            'created_at' => $this->formatDate($this->created_at),
            'shipped_at' => $this->formatDate($this->shipped_at),
            'customer' => $this->whenLoaded('user', OrderCustomerResource::class),
            'status' => $this->whenLoaded('vaultShipmentStatus', VaultShipmentStatusResource::class),
            'billing_address' => $this->whenLoaded('billingAddress', OrderAddressResource::class),
            'shipping_address' => $this->whenLoaded('shippingAddress', OrderAddressResource::class),
            'vault_shipment_item' => $this->whenLoaded('vaultShipmentItems', VaultShipmentItemCollection::class),
            'shipping_method' => $this->whenLoaded('shippingMethod', ShippingMethodResource::class),
            'payment_method' => $payments,
            'cards_number' => $this->vaultShipmentItems()->count(),
            'tracking_number' => $this->tracking_number,
            'shipping_provider' => $this->shipping_provider,
            'tracking_url' => $this->tracking_url,
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

    protected function stripeData(string $response): array
    {
        $providerResponse = json_decode($response);
        $card = $providerResponse->charges->data[0]->payment_method_details->card;
        return [
            'id' => $this->id,
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
            'transaction' => [
                'amount' => $response['amount'],
                'hash' => substr($response['txn_hash'], 0, 5) . '...' . substr($response['txn_hash'], -4),
                'complete_hash' => $response['txn_hash'],
            ],
        ];
    }
}
