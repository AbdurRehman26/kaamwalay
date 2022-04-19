<?php

namespace App\Listeners\API\Order\V2;

use App\Events\API\Order\V2\OrderStatusChangedEvent;
use App\Models\OrderItem;
use App\Models\OrderStatus;
use App\Models\User;
use App\Models\UserCard;
use App\Notifications\Order\OrderStatusChangedNotification;
use App\Services\Admin\V2\OrderService as AdminOrderService;
use App\Services\EmailService;
use App\Services\Order\V2\OrderService;
use App\Services\PopReport\PopReportService;
use DateTime;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

use function now;

class OrderStatusChangedListener implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct(
        protected EmailService $emailService,
        protected OrderService $orderService,
        protected AdminOrderService $adminOrderService,
        protected PopReportService $popReportService
    ) {
    }

    /**
     * Handle the event.
     *
     * @param OrderStatusChangedEvent $event
     * @return void
     */
    public function handle(OrderStatusChangedEvent $event)
    {
        $this->processEmails($event);
        $this->processPushNotification($event);
        $this->indexCardsForFeed($event);
    }

    protected function processEmails(OrderStatusChangedEvent $event): void
    {
        switch ($event->orderStatus->id) {
            case OrderStatus::PLACED:
                $this->handlePlaced($event);

                break;
            case OrderStatus::CONFIRMED:
                $this->handleConfirmed($event);

                break;
            case OrderStatus::GRADED:
                $this->handleGraded($event);

                break;
            case OrderStatus::SHIPPED:
                $this->handleShipped($event);

                break;
        }
    }

    protected function handlePlaced(OrderStatusChangedEvent $event): void
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

    protected function handleConfirmed(OrderStatusChangedEvent $event): void
    {
        $this->sendEmail($event, EmailService::TEMPLATE_SLUG_SUBMISSION_CONFIRMED, [
            'ORDER_NUMBER' => $event->order->order_number,
            'FIRST_NAME' => $event->order->user->first_name,
        ]);
    }

    protected function handleGraded(OrderStatusChangedEvent $event): void
    {
        $this->popReportService->updatePopReportsForOrder($event->order);

        $this->sendEmail(
            $event,
            EmailService::TEMPLATE_SLUG_SUBMISSION_GRADED,
            ['ORDER_NUMBER' => $event->order->order_number]
        );

        if (! $event->order->isPaid()) {
            $this->sendEmail(
                $event,
                EmailService::TEMPLATE_CUSTOMER_PAYMENT_DUE_REMINDER,
                $this->orderService->getDataForCustomerPaymentReminder($event->order)
            );

            $this->scheduleEmail(
                $event,
                now()->addDays(2),
                EmailService::TEMPLATE_CUSTOMER_PAYMENT_DUE_REMINDER,
                $this->orderService->getDataForCustomerPaymentReminder($event->order),
                true,
                'OrderPaymentDueReminderCheck',
                ['order_id' => $event->order->id],
            );
        }
    }

    protected function handleShipped(OrderStatusChangedEvent $event): void
    {
        $this->sendEmail($event, EmailService::TEMPLATE_SLUG_SUBMISSION_SHIPPED, [
            'FIRST_NAME' => $event->order->user->first_name,
            'TRACKING_NUMBER' => $event->order->orderShipment->tracking_number,
            'TRACKING_URL' => $event->order->orderShipment->tracking_url,
        ]);
    }

    protected function sendEmail(OrderStatusChangedEvent $event, string $template, array $vars): void
    {
        $this->emailService->sendEmail(
            [[$event->order->user->email => $event->order->user->getFullName()]],
            $this->emailService->getSubjectByTemplate($template),
            $template,
            $vars
        );
    }

    protected function sendAdminEmail(string $template, array $vars): void
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

    protected function scheduleEmail(
        OrderStatusChangedEvent $event,
        DateTime $sendAt,
        string $template,
        array $vars,
        bool $reschedulingRequired = false,
        string $checkClass = null,
        array $extraData = [],
    ): void {
        $this->emailService->scheduleEmail(
            $sendAt,
            [[$event->order->user->email => $event->order->user->getFullName()]],
            $this->emailService->getSubjectByTemplate($template),
            $template,
            $vars,
            $reschedulingRequired,
            $checkClass,
            $extraData
        );
    }

    protected function processPushNotification(OrderStatusChangedEvent $event): void
    {
        if ($event->orderStatus->id !== OrderStatus::PAYMENT_PENDING) {
            $event->order->user->notify(new OrderStatusChangedNotification($event->order));
        }
    }

    protected function indexCardsForFeed(OrderStatusChangedEvent $event): void
    {
        if ($event->orderStatus->id === OrderStatus::SHIPPED) {
            $orderItemIds = OrderItem::where('order_id', $event->order->id)->pluck('id');
            // @phpstan-ignore-next-line
            UserCard::whereIn('order_item_id', $orderItemIds)->get()->searchable();
        }
    }
}
