<?php

namespace App\Http\Resources\API\V2\CardProduct;

use App\Http\Resources\API\V1\CardProduct\CardProductResource as V1CardProductResource;

/**
 * @property-read int $population
 * @property mixed $rarity
 * @property mixed $card_number
*/
class CardProductResource extends V1CardProductResource
{
    public function toArray($request): array
    {
        $data = parent::toArray($request);

        return array_merge($data, [
            'population' => $this->population ?? 0,
            'rarity' => $this->rarity,
            'card_number' => $this->card_number,
        ]);
    }
}
