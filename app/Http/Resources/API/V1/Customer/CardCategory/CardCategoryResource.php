<?php

namespace App\Http\Resources\API\V1\Customer\CardCategory;

use Illuminate\Http\Request;
use App\Http\Resources\API\BaseResource;
use App\Models\CardCategory;

/**
 * @mixin CardCategory
*/
class CardCategoryResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'is_enabled' => $this->is_enabled,
        ];
    }
}
