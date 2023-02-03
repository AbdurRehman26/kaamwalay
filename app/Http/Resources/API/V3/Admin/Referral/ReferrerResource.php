<?php

namespace App\Http\Resources\API\V3\Admin\Referral;

use App\Models\Referrer;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Referrer */
/** @property mixed $referrer*/

class ReferrerResource extends JsonResource
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
            'id' => $this->referrer->id,
            'referral_code' => $this->referrer->referral_code,
            'withdrawable_commission' => $this->referrer->withdrawable_commission,
            'link_clicks' => $this->referrer->link_clicks,
            'successful_signups' => $this->referrer->successful_signups,
            'referral_orders' => $this->referrer->referral_orders,
            'is_referral_active' => $this->referrer->is_referral_active,
        ];
    }
}
