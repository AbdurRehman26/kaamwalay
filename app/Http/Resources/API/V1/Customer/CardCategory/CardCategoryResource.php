<?php

namespace App\Http\Resources\API\V1\Customer\CardCategory;

use App\Http\Resources\API\BaseResource;
use App\Models\CardCategory;
use Illuminate\Http\Request;

/**
 * @mixin CardCategory
*/
class CardCategoryResource extends BaseResource
{
    /**
     * Transform the resource into an array.
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
