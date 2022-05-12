<?php

namespace App\Listeners\API\VaultShipment\V2;

use App\Events\API\VaultShipment\V2\VaultShipmentStatusChangedEvent;
use App\Models\VaultShipmentStatus;
use App\Services\EmailService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class VaultShipmentStatusChangedListener implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct(
        protected EmailService $emailService,
    ) {
    }

    /**
     * Handle the event.
     *
     * @param  VaultShipmentStatusChangedEvent  $event
     * @return void
     */
    public function handle(VaultShipmentStatusChangedEvent $event)
    {
        switch ($event->vaultShipmentStatus) {
            case VaultShipmentStatus::SHIPPED:
                $this->handleShipped($event);

                break;
        }
    }

    protected function handleShipped(VaultShipmentStatusChangedEvent $event): void
    {
        $this->emailService->sendEmail(
            [[$event->vaultShipment->user->email => $event->vaultShipment->user->getFullName()]],
            $this->emailService->getSubjectByTemplate(EmailService::TEMPLATE_SLUG_SHIPPED_FROM_VAULT),
            EmailService::TEMPLATE_SLUG_SHIPPED_FROM_VAULT,
            [
                'FIRST_NAME' => $event->vaultShipment->user->first_name,
                'TRACKING_NUMBER' => $event->vaultShipment->tracking_number,
                'TRACKING_URL' => $event->vaultShipment->tracking_url,
            ]
        );
    }
}
