<?php

namespace App\Http\Resources\API\Customer\Order\OrderItem;

use App\Http\Resources\API\CardProduct\CardProductResource;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class OrderItemResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'quantity' => $this->quantity,
            'declared_value_per_unit' => $this->declared_value_per_unit,
            'card_product' => new CardProductResource($this->cardProduct),
            'status' => new ItemStatusResource($this->itemStatuses()->latest()->first()),
            'certificate_number' => !!$this->userCard ? Str::padLeft($this->userCard->userCardCertificate->id, 8, '0') : null,
        ];
    }
}
