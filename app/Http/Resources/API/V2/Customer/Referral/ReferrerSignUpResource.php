<?php

namespace App\Http\Resources\API\V2\Customer\Referral;

use App\Http\Resources\API\BaseResource;
use App\Models\User;
use App\Services\Referrer\ReferrerService;

/** @mixin User */
class ReferrerSignUpResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $referrerService = new ReferrerService();

        return [
            'id' => $this->id,
            'customer_number' => $this->customer_number,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'full_name' => $this->getFullName(),
            'profile_image' => $this->profile_image,
            'signed_up_at' => $this->formatDate($this->created_at),
            'submissions' => $this->orders()->paid()->count(),
            'cards_count' => $this->cardsCount(),
            'total_spent' => $this->orders()->paid()->sum('grand_total'),
            //TODO: Improve this
            'total_commissions' => $referrerService->getTotalCommissionsByReferee($this->referredBy, User::find($this->id)),
        ];
    }
}
