<?php

namespace App\Http\Resources\API\V3\Customer\Payout;

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
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'payout_account' => $this->payout_account,
            'status' => $this->referrerPayoutStatus->name,
            'amount' => $this->amount,
            'created_at' => $this->formatDate($this->created_at),
            'completed_at' => $this->formatDate($this->completed_at),
        ];
    }
}
