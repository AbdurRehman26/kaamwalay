<?php

namespace App\Http\Resources\API\V3\Admin;

use App\Http\Resources\API\BaseResource;
use Illuminate\Http\Request;

class TagResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'name' => $this->name
        ];
    }
}
