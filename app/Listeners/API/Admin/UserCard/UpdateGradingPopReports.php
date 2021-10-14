<?php

namespace App\Listeners\API\Admin\UserCard;

use App\Events\API\Admin\UserCard\UserCardGraded;
use App\Services\PopReport\PopReportService;
use Illuminate\Contracts\Queue\ShouldQueue;

class UpdateGradingPopReports implements ShouldQueue
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct(private PopReportService $popReportService)
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  UserCardGraded  $event
     * @return void
     */
    public function handle(UserCardGraded $event)
    {
        $this->popReportService->updateCardProductsReport($event->cardProduct);
        $this->popReportService->updateSetsReport($event->cardProduct->cardSet);
        $this->popReportService->updateSeriesReport($event->cardProduct->cardSet->cardSeries);
        //
    }
}
