<?php

namespace App\Http\Resources\API\V3\Admin\Card;

use App\Http\Resources\API\BaseResource;
use Illuminate\Http\Request;

class CardCategoryResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'image_path' => $this->image_path,
        ];
    }
}
