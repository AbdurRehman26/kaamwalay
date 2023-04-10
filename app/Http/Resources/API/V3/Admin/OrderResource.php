<?php

namespace App\Http\Resources\API\V3\Admin;

use App\Http\Resources\API\V2\Admin\Order\OrderResource as V2OrderOrderResource;
use Illuminate\Http\Request;

/**
* @method isAbandoned()
*/
class OrderResource extends V2OrderOrderResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        $data = parent::toArray($request);

        return array_merge($data, [
            'referrer' => $this->user?->referredBy,
            'referral_commission' => $this->referral_total_commission,
            'is_abandoned' => $this->whenLoaded('isAbandoned', $this->isAbandoned()->count())
        ]);
    }
}
