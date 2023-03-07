<?php

namespace App\Http\Resources\API\V3\Admin\ReferralProgram\ReferrerPayoutStatus;

use App\Models\ReferrerPayoutStatus;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin ReferrerPayoutStatus
 */
class ReferrerPayoutStatusResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'name' => $this->name,
            'description' => $this->description,
        ];
    }
}
