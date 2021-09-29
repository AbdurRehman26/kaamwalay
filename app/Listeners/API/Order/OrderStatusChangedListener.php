<?php

namespace App\Listeners\API\Order;

use App\Events\API\Order\OrderStatusChangedEvent;
use App\Models\OrderStatus;
use App\Services\EmailService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class OrderStatusChangedListener implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct(private EmailService $emailService)
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param OrderStatusChangedEvent $event
     * @return void
     */
    public function handle(OrderStatusChangedEvent $event)
    {
        switch ($event->orderStatus->id) {
            case OrderStatus::ARRIVED:
                $this->handleArrived($event);

                break;
            case OrderStatus::GRADED:
                $this->handleGraded($event);

                break;
            case OrderStatus::SHIPPED:
                $this->handleShipped($event);

                break;
        }
    }

    protected function handleArrived(OrderStatusChangedEvent $event)
    {
        // Order Arrived logics
        $this->sendEmail($event, EmailService::TEMPLATE_SLUG_SUBMISSION_ARRIVED, [
            'ORDER_NUMBER' => $event->order->order_number,
            'FIRST_NAME' => $event->order->user->first_name,
        ]);
    }

    protected function handleGraded(OrderStatusChangedEvent $event)
    {
        // Order Graded logics
    }

    protected function handleShipped(OrderStatusChangedEvent $event)
    {
        // Order Shipped logics
        $this->sendEmail($event, EmailService::TEMPLATE_SLUG_SUBMISSION_SHIPPED, [
            'FIRST_NAME' => $event->order->user->first_name,
            'TRACKING_NUMBER' => $event->order->orderShipment->tracking_number,
            'TRACKING_URL' => $event->order->orderShipment->tracking_url,
        ]);
    }

    protected function sendEmail(OrderStatusChangedEvent $event, string $template, array $vars)
    {
        $this->emailService->sendEmail(
            $event->order->user->email,
            $event->order->user->getFullName(),
            $this->emailService->getSubjectByTemplate($template),
            $template,
            $vars
        );
    }
}
