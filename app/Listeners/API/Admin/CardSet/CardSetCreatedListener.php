<?php

namespace App\Listeners\API\Admin\CardSet;

use App\Events\API\Admin\CardSetCreatedEvent;
use App\Models\CardSet;
use App\Models\PopReportsSet;
use App\Services\PopReport\PopReportService;

class CardSetCreatedListener
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
     *
     * @param  CardSetCreatedEvent  $event
     * @return void
     */
    public function handle(CardSetCreatedEvent $event)
    {
        $this->initializePopReport($event->cardSet);
    }

    protected function initializePopReport(CardSet $cardSet): PopReportsSet
    {
        return $this->popReportService->initializeSetPopReport($cardSet);
    }
}
