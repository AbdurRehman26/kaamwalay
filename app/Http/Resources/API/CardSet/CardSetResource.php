<?php

namespace App\Http\Resources\API\CardSet;

use App\Http\Resources\API\BaseResource;
use App\Http\Resources\API\CardSeries\CardSeriesResource;
use Illuminate\Http\Request;

class CardSetResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'release_date' => $this->release_date,
            'image_path' => $this->image_path,
        ];
    }
}
