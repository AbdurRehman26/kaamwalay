<?php

namespace App\Events\API\Admin\ReferralProgram;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Tymon\JWTAuth\Claims\Collection;

class BatchPayoutCreated
{
    use Dispatchable, SerializesModels;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(
        public array $data
    ) {
    }
}
