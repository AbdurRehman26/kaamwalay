<?php

namespace App\Listeners\API\Admin\CardSet;

use App\Events\API\Admin\CardSet\CardSetCreatedEvent;
use App\Models\CardSet;
use App\Models\PopReportsSet;

class CardSetCreatedListener
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
     * @param  CardSetCreatedEvent  $event
     * @return void
     */
    public function handle(CardSetCreatedEvent $event)
    {
        $this->initializePopReport($event->cardSet);
    }

    protected function initializePopReport(CardSet $cardSet): PopReportsSet
    {
        return PopReportsSet::create([
            'card_set_id' => $cardSet->id,
            'card_series_id' => $cardSet->card_series_id,
        ]);
    }
}
