<?php

namespace App\Http\Resources\API\V2\Customer\Referral;

use App\Models\Referrer;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Referrer */
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
            'referral_url' => route('referral', $this->referral_code),
            'withdrawable_commission' => $this->withdrawable_commission,
            'link_clicks' => $this->link_clicks,
            'successful_signups' => $this->successful_signups,
            'commission_earnings' => $this->commission_earnings,
            'sales_total' => $this->sales_total,
            'total_earned' => $this->total_earned,
            'is_referral_active' => $this->is_referral_active,
        ];
    }
}
