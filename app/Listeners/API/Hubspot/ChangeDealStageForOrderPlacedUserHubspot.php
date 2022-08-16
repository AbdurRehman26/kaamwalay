<?php

namespace App\Listeners\API\Hubspot;

use App\Events\API\Customer\Order\OrderPlaced;
use App\Services\HubspotService;
use Illuminate\Contracts\Queue\ShouldBeEncrypted;
use Illuminate\Contracts\Queue\ShouldQueue;

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

    public function handle(OrderPlaced $event): void
    {
        if (app()->environment('local')) {
            return;
        }

        if ($event->order->user->orders()->placed()->count() >= 2) {
            return;
        }

        if (! config('services.hubspot.api_key')) {
            return;
        }

        $this->hubspotService->updateDealStageForOrderPlacedUser($event->order);
    }
}
