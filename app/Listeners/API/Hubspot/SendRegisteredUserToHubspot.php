<?php

namespace App\Listeners\API\Hubspot;

use App\Events\API\Auth\CustomerRegistered;
use App\Services\HubspotService;
use Illuminate\Contracts\Queue\ShouldBeEncrypted;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendRegisteredUserToHubspot implements ShouldBeEncrypted, ShouldQueue
{
    public function __construct(protected HubspotService $hubspotService)
    {
        //
    }

    /**
     * @throws \SevenShores\Hubspot\Exceptions\BadRequest
     */
    public function handle(CustomerRegistered $event): void
    {
        if (app()->environment('local')) {
            return;
        }

        if (! config('services.hubspot.access_token')) {
            return;
        }

        $this->hubspotService->addUserAndAssignDeal($event->user);
    }
}
