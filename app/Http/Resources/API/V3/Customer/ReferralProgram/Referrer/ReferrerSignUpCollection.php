<?php


namespace App\Http\Resources\API\V3\Customer\ReferralProgram\Referrer;

use Illuminate\Http\Resources\Json\ResourceCollection;

class ReferrerSignUpCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return parent::toArray($request);
    }
}
