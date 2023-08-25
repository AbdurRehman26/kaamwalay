<?php

namespace App\Http\Resources\API\V2\Salesman\Order;

use App\Http\Resources\API\BaseResource;
use App\Http\Resources\API\V2\Customer\User\UserResource;
use App\Http\Resources\API\V2\Salesman\Order\PaymentMethod\PaymentMethodResource;
use App\Models\OrderPayment;
use Illuminate\Http\Request;

/** @mixin OrderPayment */
class OrderPaymentResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        if (! $this->order->isPaid()) {
            return $this->getUnpaidOrderPaymentResponse();
        }

        // In the case of extra charge or refunds happened before the user pays for the order
        // the data does not contain all the fields.
        if (empty(json_decode($this->response)) && in_array($this->type, [OrderPayment::TYPE_EXTRA_CHARGE, OrderPayment::TYPE_REFUND])) {
            return [
                'id' => $this->id,
                'notes' => $this->notes,
                'amount' => $this->amount,
                'type' => $this->getPaymentType($this->type),
                'user' => new UserResource($this->user),
                'created_at' => $this->formatDate($this->created_at),
            ];
        }

        if (! $this->response) {
            return [];
        }

        if ($this->paymentMethod->isManual()) {
            return $this->getManualPaymentResponse();
        }

        if ($this->order->paymentMethod->isPaypal() && $this->type !== OrderPayment::TYPE_REFUND) {
            return $this->paypalData(json_decode($this->response, associative: true) ?? []);
        } elseif ($this->paymentMethod->isCollectorCoin()) {
            return $this->collectorCoinData(json_decode($this->response, associative: true) ?? []);
        }

        $hasCard = ! ($this->type === OrderPayment::TYPE_REFUND || $this->paymentMethod->isWallet());

        $card = null;

        if ($hasCard) {
            $providerResponse = json_decode($this->response);

            if (! empty($providerResponse->card)) {
                $card = $providerResponse->card;
            } else {
                if (! empty($providerResponse->latest_charge) && is_object($providerResponse->latest_charge)) {
                    $card = $providerResponse->latest_charge->payment_method_details->card;
                } else {
                    // Support old Stripe response
                    $card = $providerResponse->charges->data[0]->payment_method_details->card;
                }
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
            'payment_method' => new PaymentMethodResource($this->paymentMethod),
            'user' => new UserResource($this->user),
            'created_at' => $this->formatDate($this->created_at),
        ];
    }

    protected function paypalData(array $response): array
    {
        return [
            'payer' => [
                'email' => $response['payer']['email_address'] ?? 'N/A',
                'name' => $response['payer']['name']['given_name'] ?? 'N/A',
            ],
            'payment_method' => new PaymentMethodResource($this->paymentMethod),
            'created_at' => $this->formatDate($this->created_at),
        ];
    }

    protected function collectorCoinData(array $response): array
    {
        return [
            'transaction' => [
                'amount' => $response['amount'],
                'hash' => substr($response['txn_hash'], 0, 5).'...'.substr($response['txn_hash'], -4),
                'complete_hash' => $response['txn_hash'],
            ],
            'payment_method' => new PaymentMethodResource($this->paymentMethod),
            'created_at' => $this->formatDate($this->created_at),
        ];
    }

    protected function getUnpaidOrderPaymentResponse(): array
    {
        return [
            'id' => $this->id,
            'amount' => $this->amount,
            'notes' => $this->notes,
            'type' => $this->getPaymentType($this->type),
            'user' => new UserResource($this->user),
            'created_at' => $this->formatDate($this->created_at),
        ];
    }

    protected function getManualPaymentResponse(): array
    {
        return [
            'id' => $this->id,
            'payment_method' => new PaymentMethodResource($this->paymentMethod),
            'amount' => $this->amount,
            'notes' => $this->notes,
            'type' => $this->getPaymentType($this->type),
            'user' => new UserResource($this->user),
            'created_at' => $this->formatDate($this->created_at),
        ];
    }
}
