<?php

namespace App\Http\Resources\API\V2\Landings\PopReports\PopReportsCard;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class PopReportsCardCollection extends ResourceCollection
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