<?php

namespace App\Http\Resources\API\V2\CardProduct;

use App\Http\Resources\API\V1\CardProduct\CardProductResource as V1CardProductResource;
use App\Http\Resources\API\V2\Admin\CardCategory\CardCategoryResource;
use App\Http\Resources\API\V2\CardSet\CardSetResource;
use App\Models\CardProduct;

/**
 * @mixin CardProduct
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
            'card_category' => $this->whenLoaded('cardCategory', CardCategoryResource::class),
            'card_set' => $this->whenLoaded('cardSet', CardSetResource::class),
        ]);
    }
}
