<?php

namespace App\Http\Resources\API\V3\Customer;

use App\Http\Resources\API\BaseResource;
use App\Models\User;
use Illuminate\Http\Request;

/**
 * @mixin User
 */
class CustomerResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'email' => $this->maskEmail(),
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'customer_number' => $this->customer_number,
            'profile_image' => $this->profile_image,
        ];
    }

    public function maskEmail(): string
    {
        $email = $this->email;

        // Separate the local part and domain
        [$localPart, $domain] = explode('@', $email, 2);

        // Mask all characters in the local part except the first letter
        $maskedLocalPart = $localPart[0].str_repeat('*', max(0, strlen($localPart) - 1));

        // Separate the domain into subdomain and top-level domain
        [$subdomain, $tld] = explode('.', $domain, 2);

        // Mask all characters in the subdomain
        $maskedSubdomain = str_repeat('*', strlen($subdomain));

        // Combine the masked local part, masked subdomain, and top-level domain
        return $maskedLocalPart.'@'.$maskedSubdomain.'.'.$tld;
    }
}
