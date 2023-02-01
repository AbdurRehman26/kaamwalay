<?php

namespace App\Http\Resources\API\V3\Customer\Referee;

use App\Http\Resources\API\BaseResource;
use Illuminate\Http\Request;

class CouponResource extends BaseResource
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
            'code' => $this->code,
            'available_from' => $this->available_from,
        ];
    }
}
