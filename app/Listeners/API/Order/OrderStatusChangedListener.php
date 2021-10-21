<?php

namespace App\Listeners\API\Order;

use App\Events\API\Order\OrderStatusChangedEvent;
use App\Models\OrderStatus;
use App\Models\User;
use App\Services\Admin\OrderService as AdminOrderService;
use App\Services\EmailService;
use App\Services\Order\OrderService;
use DateTime;
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
    public function __construct(private EmailService $emailService, private OrderService $orderService, private AdminOrderService $adminOrderService)
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
            case OrderStatus::PLACED:
                $this->handlePlaced($event);

                break;
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

    protected function handlePlaced(OrderStatusChangedEvent $event)
    {
        $this->sendEmail(
            $event,
            EmailService::TEMPLATE_SLUG_SUBMISSION_PLACED,
            $this->orderService->getDataForCustomerSubmissionConfirmationEmail($event->order)
        );
        
        $this->sendAdminEmail(
            EmailService::TEMPLATE_SLUG_ADMIN_SUBMISSION_PLACED,
            $this->adminOrderService->getDataForAdminSubmissionConfirmationEmail($event->order)
        );

        $this->scheduleEmail(
            $event,
            now()->addDay(),
            EmailService::TEMPLATE_SLUG_CUSTOMER_SHIPMENT_TRACKING_REMINDER,
            [
                'FIRST_NAME' => $event->order->user->first_name,
            ]
        );
    }

    protected function handleArrived(OrderStatusChangedEvent $event)
    {
        $this->sendEmail($event, EmailService::TEMPLATE_SLUG_SUBMISSION_ARRIVED, [
            'ORDER_NUMBER' => $event->order->order_number,
            'FIRST_NAME' => $event->order->user->first_name,
        ]);
    }

    protected function handleGraded(OrderStatusChangedEvent $event)
    {
        $this->sendEmail(
            $event,
            EmailService::TEMPLATE_SLUG_SUBMISSION_GRADED,
            ['ORDER_NUMBER' => $event->order->order_number]
        );
    }

    protected function handleShipped(OrderStatusChangedEvent $event)
    {
        $this->sendEmail($event, EmailService::TEMPLATE_SLUG_SUBMISSION_SHIPPED, [
            'FIRST_NAME' => $event->order->user->first_name,
            'TRACKING_NUMBER' => $event->order->orderShipment->tracking_number,
            'TRACKING_URL' => $event->order->orderShipment->tracking_url,
        ]);
    }

    protected function sendEmail(OrderStatusChangedEvent $event, string $template, array $vars)
    {
        $this->emailService->sendEmail(
            [[$event->order->user->email => $event->order->user->getFullName()]],
            $this->emailService->getSubjectByTemplate($template),
            $template,
            $vars
        );
    }

    protected function sendAdminEmail(string $template, array $vars)
    {
        $data = User::admin()->get()->map(function ($value) {
            return [$value->email => $value->name];
        })->toArray();
        $this->emailService->sendEmail(
            $data,
            $this->emailService->getSubjectByTemplate($template),
            $template,
            $vars
        );
    }

    protected function scheduleEmail(OrderStatusChangedEvent $event, DateTime $sendAt, string $template, array $vars)
    {
        $this->emailService->scheduleEmail(
            $sendAt,
            [[$event->order->user->email => $event->order->user->getFullName()]],
            $this->emailService->getSubjectByTemplate($template),
            $template,
            $vars
        );
    }
}
