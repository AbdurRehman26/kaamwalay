<?php

namespace App\Http\Resources\API\V2\Admin\State;

use App\Models\State;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin State */
class StateResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'name' => $this->name,
        ];
    }
}
