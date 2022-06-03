<?php

namespace App\Listeners\API\Hubspot;

use App\Events;
use App\Events\API\Customer\Order\OrderPlaced;
use App\Services\HubspotService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Contracts\Queue\ShouldBeEncrypted;

class ChangeDealStageForOrderPlacedUserHubspot implements ShouldQueue, ShouldBeEncrypted
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

    /**
     * Handle the event.
     *
     * @param  \App\Events\OrderPlaced  $event
     * @return void
     */
    public function handle(OrderPlaced $event)
    {
        if (app()->environment('local')) {
            return;
        }

        if (! config('services.hubspot.api_key')) {
            return;
        }

        $this->hubspotService->updateDealStageForOrderPlacedUser($event->order->user);
    }
}
