<?php

namespace App\Http\Resources\API\V3\Admin\ReferralProgram\Referrer;

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
            'id' => $this->id,
            'referral_code' => $this->referral_code,
            'withdrawable_commission' => $this->withdrawable_commission,
            'link_clicks' => $this->link_clicks,
            'successful_signups' => $this->successful_signups,
            'referral_orders' => $this->referral_orders,
            'is_referral_active' => $this->is_referral_active,
        ];
    }
}
