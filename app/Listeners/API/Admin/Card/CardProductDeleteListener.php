<?php

namespace App\Listeners\API\Admin\Card;

use App\Events\API\Admin\Card\CardProductDeleteEvent;
use App\Models\CardProduct;
use App\Models\PopReportsCard;
use App\Services\PopReport\PopReportService;

class CardProductDeleteListener
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
    public function handle(CardProductDeleteEvent $event): void
    {
        $this->popReportService->deleteCardPopReport($event->cardProduct);
    }

}
