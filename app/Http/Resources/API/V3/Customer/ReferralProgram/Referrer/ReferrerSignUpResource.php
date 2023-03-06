<?php

namespace App\Http\Resources\API\V3\Customer\ReferralProgram\Referrer;

use App\Http\Resources\API\BaseResource;
use App\Models\User;
use App\Services\ReferralProgram\ReferrerService;

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
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'full_name' => $this->getFullName(),
            'profile_image' => $this->profile_image,
            'signed_up_at' => $this->formatDate($this->created_at),
            'submissions' => $this->orders()->paid()->count(),
            'cards_count' => $this->cardsCount(),
            'total_spent' => $this->orders()->paid()->sum('grand_total'),
            'total_commissions' => $referrerService->getTotalReferrerCommissionsByReferee($this->referred_by, $this->id),
        ];
    }
}
