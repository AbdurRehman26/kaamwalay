<?php

namespace App\Http\Resources\API\V3\Admin;

use App\Http\Resources\API\V2\Admin\Order\OrderResource as OrderOrderResource;

class OrderResource extends OrderOrderResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request): array
    {
        $data = parent::toArray($request);

        return array_merge($data, [
            'referrer' => $this->user->referredBy,
            'referrel_commission' => $this->referral_total_commission,
        ]);
    }
}
