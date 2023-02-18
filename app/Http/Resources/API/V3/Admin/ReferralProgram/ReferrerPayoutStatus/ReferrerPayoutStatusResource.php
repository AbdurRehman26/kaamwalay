<?php

namespace App\Http\Resources\API\V3\Admin\ReferralProgram\ReferrerPayoutStatus;

use App\Http\Resources\API\V2\Admin\Customer\CustomerResource as V2CustomerResource;
use App\Http\Resources\API\V3\Admin\ReferralProgram\Referrer\ReferrerResource;
use App\Http\Resources\API\V3\Customer\User\UserResource;
use App\Models\PayoutStatus;
use App\Models\ReferrerPayout;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin PayoutStatus
 */
class ReferrerPayoutStatusResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'name' => $this->name,
            'description' => $this->description,
        ];
    }
}
