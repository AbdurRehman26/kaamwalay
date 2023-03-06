<?php

namespace App\Http\Resources\API\V3\Admin;

use App\Http\Resources\API\V2\Admin\Order\OrderResource as V2OrderOrderResource;
use Illuminate\Http\Request;

class OrderResource extends V2OrderOrderResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */
    public function toArray($request): array
    {
        $data = parent::toArray($request);

        return array_merge($data, [
            'referrer' => $this->user?->referredBy,
            'referral_commission' => $this->referral_total_commission,
        ]);
    }
}
