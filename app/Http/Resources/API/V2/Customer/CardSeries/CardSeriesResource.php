<?php

namespace App\Http\Resources\API\V2\Customer\CardSeries;

use App\Http\Resources\API\BaseResource;
use App\Models\CardSeries;
use Illuminate\Http\Request;

/**
 * @mixin CardSeries
 */
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
            'release_date' => $this->release_date,
        ];
    }
}
