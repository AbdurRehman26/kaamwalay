<?php

namespace App\Http\Resources\API\V1\Customer\UserCard;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use JsonSerializable;

class UserCardListCollection extends ResourceCollection
{
    public $collects = UserCardListResource::class;
    /**
     * Transform the resource collection into an array.
     *
     * @param  Request  $request
     * @return array|Arrayable|JsonSerializable
     */
    public function toArray($request)
    {
        return parent::toArray($request);
    }
}
