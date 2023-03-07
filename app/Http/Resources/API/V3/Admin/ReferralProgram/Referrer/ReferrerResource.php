<?php

namespace App\Http\Resources\API\V3\Admin\ReferralProgram\Referrer;

use Illuminate\Http\Request;
use App\Models\Referrer;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Referrer */
class ReferrerResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
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
