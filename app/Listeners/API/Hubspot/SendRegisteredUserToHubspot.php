<?php

namespace App\Listeners\API\Hubspot;

use App\Events\API\Auth\CustomerRegistered;
use App\Services\HubspotService;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendRegisteredUserToHubspot implements ShouldQueue
{
    public function __construct(protected HubspotService $hubspotService)
    {
        //
    }

    public function handle(CustomerRegistered $event): void
    {
        if (app()->environment('local')) {
            return;
        }

        $this->hubspotService->addUserAndAssignDeal($event->user);
    }
}
