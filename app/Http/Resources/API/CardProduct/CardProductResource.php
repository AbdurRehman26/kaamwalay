<?php

namespace App\Http\Resources\API\CardProduct;

use Illuminate\Http\Resources\Json\JsonResource;

class CardProductResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
        ];
    }
}
