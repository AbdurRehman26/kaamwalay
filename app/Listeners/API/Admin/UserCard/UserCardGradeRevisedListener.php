<?php

namespace App\Listeners\API\Admin\UserCard;

use App\Events\API\Admin\UserCard\UserCardGradeRevisedEvent;
use App\Services\PopReport\PopReportService;
use Illuminate\Contracts\Queue\ShouldQueue;

class UserCardGradeRevisedListener implements ShouldQueue
{
    /** @var bool */
    public $afterCommit = true;

    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct(protected PopReportService $popReportService)
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  UserCardGradeRevisedEvent  $event
     * @return void
     */
    public function handle(UserCardGradeRevisedEvent $event)
    {
        $this->popReportService->updateCardProductsReport($event->userCard->orderItem->cardProduct);
        $this->popReportService->updateSetsReport($event->userCard->orderItem->cardProduct->cardSet);
        $this->popReportService->updateSeriesReport($event->userCard->orderItem->cardProduct->cardSet->cardSeries);
    }
}
