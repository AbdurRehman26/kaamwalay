<?php

namespace App\Listeners\API\Admin\CardSeries;

use App\Events\API\Admin\CardSeries\CardSeriesCreatedEvent;
use App\Models\CardSeries;
use App\Models\PopReportsSeries;

class CardSeriesCreatedListener
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
    }

    /**
     * Handle the event.
     *
     * @param  CardSeriesCreatedEvent  $event
     * @return void
     */
    public function handle(CardSeriesCreatedEvent $event)
    {
        $this->initializePopReport($event->cardSeries);
    }

    protected function initializePopReport(CardSeries $cardSeries): PopReportsSeries
    {
        return PopReportsSeries::create([
            'card_series_id' => $cardSeries->id,
        ]);
    }
}
