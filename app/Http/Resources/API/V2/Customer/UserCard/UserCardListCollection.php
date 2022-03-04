<?php

namespace App\Http\Resources\API\V2\Customer\UserCard;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class UserCardListCollection extends ResourceCollection
{
    public $collects = UserCardListResource::class;
    /**
     * Transform the resource collection into an array.
     *
     * @param  Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return parent::toArray($request);
    }
}
