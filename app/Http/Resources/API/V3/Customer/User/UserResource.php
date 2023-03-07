<?php

namespace App\Http\Resources\API\V3\Customer\User;

use Illuminate\Http\Request;
use App\Http\Resources\API\V2\Customer\User\UserResource as V2UserResource;
use App\Models\User;

/** @mixin User */
class UserResource extends V2UserResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray(Request $request): array
    {
        $data = parent::toArray($request);

        return array_merge($data, [
            'show_referral_promotional_popup' => $this->referrer->referral_orders <= 0 &&
                $this->referrer->is_referral_active,
        ]);
    }
}
