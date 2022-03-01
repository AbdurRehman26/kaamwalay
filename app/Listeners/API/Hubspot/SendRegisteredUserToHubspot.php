<?php

namespace App\Listeners\API\Hubspot;

use App\Events\API\Auth\CustomerRegistered;
use App\Services\HubspotService;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendRegisteredUserToHubspot implements ShouldQueue
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
     * @param  \App\Events\CustomerRegistered  $event
     * @return void
     */
    public function handle(CustomerRegistered $event): void
    {
        if (app()->environment('local')) {
            return;
        }

        $this->hubspotService->addUserAndAssignDeal($event->user);
    }
}
