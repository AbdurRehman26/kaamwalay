<?php

namespace App\Events\API\Admin\ReferralProgram;

use App\Models\ReferrerPayout;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PayoutInitiated
{
    use Dispatchable, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(
        public ReferrerPayout $referrerPayout
    ) {
        //
    }
}
