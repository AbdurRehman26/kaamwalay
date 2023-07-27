<?php

namespace App\Listeners\API\Admin\Card;

use App\Events\API\Admin\Card\CardProductDeletedEvent;
use App\Services\PopReport\PopReportService;

class CardProductDeletedListener
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct(protected PopReportService $popReportService)
    {
    }

    /**
     * Handle the event.
     */
    public function handle(CardProductDeletedEvent $event): void
    {
        $this->popReportService->deleteCardPopReport($event->cardProduct);
    }
}
