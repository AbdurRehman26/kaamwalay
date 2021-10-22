<?php

namespace App\Listeners\API\Admin\OrderItem;

use App\Events\API\Admin\OrderItem\OrderItemCardChangedEvent;
use App\Models\OrderItemStatus;
use App\Services\Admin\OrderService;
use App\Services\AGS\AgsService;
use Illuminate\Contracts\Queue\ShouldQueue;

class OrderItemCardChangedListener implements ShouldQueue
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct(protected AgsService $agsService, protected OrderService $orderService)
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
        $this->updateAgsCertificateCard($event);
    }

    protected function updateAgsCertificateCard($event): void
    {
        $data = $this->orderService->getOrderItemCertificateData($event->orderItem);

        $this->agsService->createCertificates($data);
    }
}
