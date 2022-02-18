<?php

namespace App\Http\Resources\API\V1\Admin\CardCategory;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use JsonSerializable;

class CardCategoryCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @param  Request  $request
     * @return array|Arrayable<int, Model>|JsonSerializable
     */
    public function toArray($request)
    {
        return parent::toArray($request);
    }
}
