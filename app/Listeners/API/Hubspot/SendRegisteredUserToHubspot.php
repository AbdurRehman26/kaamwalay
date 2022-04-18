<?php

namespace App\Listeners\API\Hubspot;

use App\Events\API\Auth\CustomerRegistered;
use App\Services\HubspotService;
use Illuminate\Contracts\Queue\ShouldBeEncrypted;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendRegisteredUserToHubspot implements ShouldQueue, ShouldBeEncrypted
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

        if (! config('services.hubspot.api_key')) {
            return;
        }

        $this->hubspotService->addUserAndAssignDeal($event->user);
    }
}
