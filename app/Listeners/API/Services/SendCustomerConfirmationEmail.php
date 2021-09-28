<?php

namespace App\Listeners\API\Services;

use App\Events\API\Customer\Order\OrderPaid;
use App\Services\EmailService;
use App\Services\Order\OrderService;
use Illuminate\Contracts\Queue\ShouldBeEncrypted;

class SendCustomerConfirmationEmail implements ShouldBeEncrypted
{
    public function __construct(protected EmailService $emailService, protected OrderService $orderService)
    {
    }

    public function handle(OrderPaid $event): void
    {
        $order = $event->order;

        $this->emailService->sendEmail(
            $order->user->email,
            $order->user->first_name ?? '',
            EmailService::SUBJECT[EmailService::TEMPLATE_SLUG_CUSTOMER_CONFIRMATION],
            EmailService::TEMPLATE_SLUG_CUSTOMER_CONFIRMATION,
            $this->orderService->getSubmissionConfirmationData($order)
        );
    }
}
