<?php

namespace App\Listeners\API\Order\V2;

use App\Events\API\Customer\Order\OrderPaid;
use App\Services\EmailService;
use App\Services\Order\V2\OrderService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class OrderPaidListener implements ShouldQueue
{
    use InteractsWithQueue;

    public int $tries = 3;

    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct(protected EmailService $emailService, protected OrderService $orderService)
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  OrderPaid  $event
     * @return void
     */
    public function handle(OrderPaid $event): void
    {
        $this->emailService->sendEmail(
            [[$event->order->user->email => $event->order->user->getFullName()]],
            $this->emailService->getSubjectByTemplate(EmailService::TEMPLATE_SLUG_CUSTOMER_ORDER_PAID),
            EmailService::TEMPLATE_SLUG_CUSTOMER_ORDER_PAID,
            $this->orderService->getDataForCustomerOrderPaid($event->order)
        );
    }
}
