<?php

namespace App\Listeners\API\Hubspot;

use App\Events\API\Customer\Order\OrderPaid;
use App\Services\HubspotService;
use Illuminate\Contracts\Queue\ShouldBeEncrypted;
use Illuminate\Contracts\Queue\ShouldQueue;

class ChangeDealStageForPaidOrderHubspot implements ShouldQueue, ShouldBeEncrypted
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct(protected HubspotService $hubspotService)
    {
        //
    }

    public function handle(OrderPaid $event): void
    {
        if (app()->environment('local')) {
            return;
        }

        if (! config('services.hubspot.api_key')) {
            return;
        }

        $this->hubspotService->updateDealStageForPaidOrder($event->order);
    }
}
