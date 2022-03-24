<?php

namespace App\Http\Resources\API\V2\Customer\CardCategory;

use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Http\Request;

class CardCategoryCollection extends ResourceCollection
{
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
