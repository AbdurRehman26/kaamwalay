<?php

namespace App\Listeners\API\ReferralProgram\ReferrerPayouts;

use App\Events\API\Admin\ReferralProgram\BatchPayoutCreated;
use App\Services\Admin\V3\ReferralProgram\ReferrerPayoutService;
use Illuminate\Contracts\Queue\ShouldQueue;

class ProcessBatchPayoutCreation implements ShouldQueue
{
    public function __construct(protected ReferrerPayoutService $referrerPayoutService)
    {
    }

    public function handle(BatchPayoutCreated $event): void
    {
        $this->referrerPayoutService->processBatchPayout($event->data);
    }
}
