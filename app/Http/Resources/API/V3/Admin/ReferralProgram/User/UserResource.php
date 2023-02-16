<?php

namespace App\Http\Resources\API\V3\Admin\ReferralProgram\User;

use App\Http\Resources\API\BaseResource;
use App\Models\User;
use Illuminate\Http\Request;

/**
 * @mixin User
 */
class UserResource extends BaseResource
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
            'profile_image' => $this->profile_image,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'full_name' => $this->getFullName(),
            'customer_number' => $this->customer_number,
            'email' => $this->email,
            'phone' => $this->phone,
            'created_at' => $this->formatDate($this->created_at),
            'submissions' => $this->getReferrerSubmissions(),
            'cards_count' => $this->getReferrerCardsCount(),
            'sign_ups' => $this->referrer->successful_signups,
            'is_referral_active' => $this->referrer->is_referral_active,
            'sales' => $this->getReferrerSales(),
            'commission' => $this->getReferrerCommission(),
        ];
    }
}
