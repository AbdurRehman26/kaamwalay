<?php

namespace App\Http\Resources\API\V2\Admin\CardLabel;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class CardLabelCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @param Request $request
     * @return array
     */
    public function toArray($request): array
    {
        return parent::toArray($request);
    }
}
