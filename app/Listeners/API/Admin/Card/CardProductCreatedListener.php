<?php

namespace App\Listeners\API\Admin\Card;

use App\Events\API\Admin\Card\CardProductCreatedEvent;
use App\Models\CardProduct;
use App\Models\PopReportsCard;
use App\Services\PopReport\PopReportService;

class CardProductCreatedListener
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
     * @param  CardProductCreatedEvent  $event
     * @return void
     */
    public function handle(CardProductCreatedEvent $event)
    {
        $this->initializePopReport($event->cardProduct);
    }

    protected function initializePopReport(CardProduct $cardProduct): PopReportsCard
    {
        return $this->popReportService->initializeCardPopReport($cardProduct);
    }
}
