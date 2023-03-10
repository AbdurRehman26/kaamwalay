<?php

namespace App\Http\Resources\API\V2\CardSet;

use App\Http\Resources\API\BaseResource;
use App\Models\CardSet;
use Illuminate\Http\Request;

/**
 * @mixin CardSet
 */
class CardSetResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'release_date' => $this->release_date,
            'image_path' => $this->image_path,
        ];
    }
}
