<?php

namespace App\Listeners\API\Admin\OrderItem;

use App\Events\API\Admin\OrderItem\OrderItemCardChangedEvent;
use App\Models\OrderItemStatus;
use App\Services\PopReport\PopReportService;
use Illuminate\Contracts\Queue\ShouldQueue;

class OrderItemCardChangedListener implements ShouldQueue
{
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
     * @param  OrderItemCardChangedEvent  $event
     * @return void
     */
    public function handle(OrderItemCardChangedEvent $event)
    {
        switch ($event->orderItem->order_item_status_id) {
            case OrderItemStatus::GRADED:
                $this->handleGraded($event);

                break;
        }
    }

    protected function handleGraded($event)
    {
        $this->updatePopReports($event);
    }

    protected function updatePopReports($event): void
    {
        $this->popReportService->updateCardProductsReport($event->previousCardProduct);
        $this->popReportService->updateSetsReport($event->previousCardProduct->cardSet);
        $this->popReportService->updateSeriesReport($event->previousCardProduct->cardSet->cardSeries);

        $this->popReportService->updateCardProductsReport($event->orderItem->cardProduct);
        $this->popReportService->updateSetsReport($event->orderItem->cardProduct->cardSet);
        $this->popReportService->updateSeriesReport($event->orderItem->cardProduct->cardSet->cardSeries);
    }
}
