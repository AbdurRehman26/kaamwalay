<?php

namespace App\Http\Resources\API\V1\Admin\CardCategory;

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
     *
     * @param  Request  $request
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
