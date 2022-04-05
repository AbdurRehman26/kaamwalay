<?php

namespace App\Http\Resources\API\V2\Landings\PopReports\CardCategory;

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
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'image_url' => $this->image_url,
        ];
    }
}
