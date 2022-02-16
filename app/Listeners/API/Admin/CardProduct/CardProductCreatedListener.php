<?php

namespace App\Listeners\API\Admin\CardProduct;

use App\Events\API\Admin\CardProduct\CardProductCreatedEvent;
use App\Models\CardProduct;
use App\Models\PopReportsCard;

class CardProductCreatedListener
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
     * @param  CardProductCreatedEvent  $event
     * @return void
     */
    public function handle(CardProductCreatedEvent $event)
    {
        $this->initializePopReport($event->cardProduct);
    }

    protected function initializePopReport(CardProduct $cardProduct): PopReportsCard
    {
        return PopReportsCard::create([
            'card_product_id' => $cardProduct->id,
            'card_set_id' => $cardProduct->card_set_id,
        ]);
    }
}
