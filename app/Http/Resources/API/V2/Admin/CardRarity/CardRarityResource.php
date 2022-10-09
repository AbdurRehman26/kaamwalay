<?php

namespace App\Http\Resources\API\V2\Admin\CardRarity;

use App\Http\Resources\API\BaseResource;
use Illuminate\Http\Request;

class CardRarityResource extends BaseResource
{
    /**
     * Transform the resource collection into an array.
     *
     * @param Request $request
     * @return array
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'card_category_name' => $this->cardCategory?->name,
            'card_category_id' => $this->card_category_id,
        ];
    }
}
