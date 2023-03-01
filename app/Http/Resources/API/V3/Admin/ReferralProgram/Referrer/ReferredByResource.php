<?php

namespace App\Http\Resources\API\V3\Admin\ReferralProgram\Referrer;

use App\Models\User;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin User */
class ReferredByResource extends JsonResource
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
            'customer_number' => $this->customer_number,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'full_name' => $this->getFullName(),
        ];
    }
}
