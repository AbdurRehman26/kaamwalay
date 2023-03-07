<?php

namespace App\Http\Resources\API\V2\Landings\PopReports\CardCategory;

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
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'image_url' => $this->image_url,
        ];
    }
}
