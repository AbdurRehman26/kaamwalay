<?php

namespace App\Http\Resources\API\V1\CardSeries;

use App\Http\Resources\API\BaseResource;
use Illuminate\Http\Request;

class CardSeriesResource extends BaseResource
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
            'image_path' => $this->image_path,
        ];
    }
}
