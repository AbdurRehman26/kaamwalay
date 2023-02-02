<?php

namespace App\Http\Resources\API\V3\Admin\Customer;

use App\Http\Resources\API\V2\Admin\Customer\CustomerResource as V2CustomerResource;
use App\Http\Resources\API\V3\Admin\Referral\ReferrerResource;
use App\Http\Resources\API\V3\Customer\User\UserResource;
use App\Models\User;
use Illuminate\Http\Request;

/**
 * @mixin User
 */
class CustomerResource extends V2CustomerResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array
     */
    public function toArray($request): array
    {
        $data = parent::toArray($request);

        return array_merge($data, [
            'referrer' => new UserResource($this->referredBy),
            'referral_status' => $this->referrer->is_referral_active,
        ]);
    }
}
