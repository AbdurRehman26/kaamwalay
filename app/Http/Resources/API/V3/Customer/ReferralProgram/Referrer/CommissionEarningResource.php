<?php

namespace App\Http\Resources\API\V3\Customer\ReferralProgram\Referrer;

use Illuminate\Http\Request;
use App\Http\Resources\API\BaseResource;
use App\Models\Order;

/**
 * @mixin Order
 * @property mixed $commission
 */

class CommissionEarningResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'first_name' => $this->user->first_name,
            'last_name' => $this->user->last_name,
            'full_name' => $this->user->getFullName(),
            'profile_image' => $this->user->profile_image,
            'paid_at' => $this->formatDate($this->paid_at),
            'cards' => (int)$this->orderItems()->sum('quantity'),
            'submission_total' => $this->grand_total,
            'commission' => $this->commission,
        ];
    }
}
