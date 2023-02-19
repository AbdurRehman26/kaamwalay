<?php

namespace App\Http\Resources\API\V3\Customer\ReferralProgram\Payout;

use App\Http\Resources\API\BaseResource;
use App\Models\ReferrerPayout;
use Illuminate\Http\Request;

/** @mixin ReferrerPayout */
class ReferrerPayoutResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'date_initiated' => $this->initiated_at,
            'completed_at' => $this->completed_at,
            'payout_account' => $this->payout_account,
            'status' => $this->payoutStatus->name,
            'amount' => $this->amount,
        ];
    }
}
