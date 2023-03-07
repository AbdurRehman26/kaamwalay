<?php

namespace App\Http\Resources\API\V2\Customer\UserCard;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class UserCardListCollection extends ResourceCollection
{
    public $collects = UserCardListResource::class;
    /**
     * Transform the resource collection into an array.
     */
    public function toArray(Request $request): array
    {
        return parent::toArray($request);
    }
}
