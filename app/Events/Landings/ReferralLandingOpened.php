<?php

namespace App\Events\Landings;

use App\Models\Referrer;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ReferralLandingOpened
{
    use Dispatchable, SerializesModels;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(
        public Referrer $referrer,
    ) {
    }
}
