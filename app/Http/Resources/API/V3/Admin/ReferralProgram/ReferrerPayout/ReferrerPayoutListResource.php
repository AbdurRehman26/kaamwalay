<?php

namespace App\Http\Resources\API\V3\Admin\ReferralProgram\ReferrerPayout;

use App\Http\Resources\API\BaseResource;
use App\Http\Resources\API\V3\Admin\ReferralProgram\ReferrerPayoutStatus\ReferrerPayoutStatusResource;
use App\Models\ReferrerPayout;
use Illuminate\Http\Request;

/**
 * @mixin ReferrerPayout
 */
class ReferrerPayoutListResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user' => new UserResource($this->user),
            'created_at' => $this->formatDate($this->created_at),
            'completed_at' => $this->formatDate($this->completed_at),
            'payout_account' => $this->payout_account,
            'paid_by' => new UserResource($this->paidBy),
            'status' => new ReferrerPayoutStatusResource($this->referrerPayoutStatus),
            'amount' => $this->amount,
        ];
    }
}
