<?php

namespace App\Listeners\API\Services;

use App\Events\API\Customer\Order\OrderPaid;
use App\Services\EmailService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendShipmentTrackingReminderEmail implements ShouldQueue
{
    use InteractsWithQueue;

    public $tries = 5;

    public function __construct(public EmailService $emailService)
    {
        //
    }

    public function handle(OrderPaid $event)
    {
        $template = EmailService::TEMPLATE_SLUG_CUSTOMER_SHIPMENT_TRACKING_REMINDER;
        $this->emailService->scheduleEmail((now()->addDay()), $event->order->user->email, $event->order->user->getFullName(), $this->emailService->getSubjectByTemplate($template) , $template , ['FIRST_NAME' => $event->order->user->first_name]);

    }
}
