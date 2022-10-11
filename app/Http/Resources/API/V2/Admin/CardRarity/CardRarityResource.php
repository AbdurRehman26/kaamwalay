<?php

namespace App\Http\Resources\API\V2\Admin\CardRarity;

use App\Http\Resources\API\BaseResource;
use App\Http\Resources\API\V1\Admin\CardCategory\CardCategoryResource;
use App\Models\CardRarity;
use Illuminate\Http\Request;

/**
 * @mixin CardRarity
 */
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
            'card_category' => new CardCategoryResource($this->cardCategory),
        ];
    }
}
