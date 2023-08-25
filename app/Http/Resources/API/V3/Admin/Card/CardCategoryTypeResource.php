<?php

namespace App\Http\Resources\API\V3\Admin\Card;

use App\Http\Resources\API\BaseResource;
use App\Models\CardCategoryType;
use Illuminate\Http\Request;

/**
 * @mixin CardCategoryType
 */
class CardCategoryTypeResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
        ];
    }
}
