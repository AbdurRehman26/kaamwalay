<?php

namespace App\Http\Resources\API\V2\Admin\CardSurface;

use App\Http\Resources\API\BaseResource;
use App\Http\Resources\API\V2\Admin\CardCategory\CardCategoryResource;
use App\Models\CardSurface;
use Illuminate\Http\Request;

/**
 * @mixin CardSurface
 */
class CardSurfaceResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'card_category' => new CardCategoryResource($this->cardCategory),
        ];
    }
}
