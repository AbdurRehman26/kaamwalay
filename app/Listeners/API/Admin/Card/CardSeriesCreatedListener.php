<?php

namespace App\Listeners\API\Admin\Card;

use App\Events\API\Admin\Card\CardSeriesCreatedEvent;
use App\Models\CardSeries;
use App\Models\PopReportsSeries;
use App\Services\PopReport\PopReportService;

class CardSeriesCreatedListener
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
     * @param  CardSeriesCreatedEvent  $event
     * @return void
     */
    public function handle(CardSeriesCreatedEvent $event): void
    {
        $this->initializePopReport($event->cardSeries);
    }

    protected function initializePopReport(CardSeries $cardSeries): PopReportsSeries
    {
        return $this->popReportService->initializeSeriesPopReport($cardSeries);
    }
}
