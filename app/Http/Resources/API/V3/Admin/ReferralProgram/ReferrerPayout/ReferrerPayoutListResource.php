<?php

namespace App\Http\Resources\API\V3\Admin\ReferralProgram\ReferrerPayout;

use App\Http\Resources\API\V3\Admin\ReferralProgram\ReferrerPayoutStatus\ReferrerPayoutStatusResource;
use App\Models\ReferrerPayout;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin ReferrerPayout
 */
class ReferrerPayoutListResource extends JsonResource
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
            'user' => new UserResource($this->user),
            'initiated_at' => $this->created_at,
            'completed_at' => $this->completed_at,
            'payout_account' => $this->payout_account,
            'paid_by' => new UserResource($this->paidBy),
            'status' => new ReferrerPayoutStatusResource($this->payoutStatus),
            'amount' => $this->amount,
        ];
    }
}
