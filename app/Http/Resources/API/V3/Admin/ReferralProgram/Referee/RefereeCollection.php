<?php

namespace App\Http\Resources\API\V3\Admin\ReferralProgram\Referee;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class RefereeCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @param  Request  $request
     */
    public function toArray($request): array
    {
        return parent::toArray($request);
    }
}
