<?php

namespace App\Listeners\API\Order\V2;

use App\Enums\Salesman\CommissionEarnedEnum;
use App\Events\API\Customer\Order\OrderPaid;
use App\Services\EmailService;
use App\Services\Order\V2\OrderService;
use App\Services\ReferralProgram\ReferrerCommissionService;
use App\Services\SalesmanCommission\SalesmanCommissionService;
use Illuminate\Contracts\Queue\ShouldQueue;

class OrderPaidListener implements ShouldQueue
{
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
     */
    public function handle(OrderPaid $event): void
    {
        $this->processEmails($event);
        $this->processSalesmanCommission($event);
        $this->processReferrerCommission($event);
        $this->processOrderAbandoned($event);
    }

    protected function processEmails(OrderPaid $event): void
    {
        $this->emailService->sendEmail(
            [[$event->order->user->email => $event->order->user->getFullName()]],
            $this->emailService->getSubjectByTemplate(EmailService::TEMPLATE_SLUG_CUSTOMER_ORDER_PAID),
            EmailService::TEMPLATE_SLUG_CUSTOMER_ORDER_PAID,
            $this->orderService->getDataForCustomerOrderPaid($event->order)
        );

        if ($event->order->user->referredBy) {
            $this->emailService->sendEmail(
                [[$event->order->user->referredBy->email => $event->order->user->referredBy->first_name ?? '']],
                EmailService::SUBJECT[EmailService::TEMPLATE_SLUG_REFEREE_COMMISSION_EARNING],
                EmailService::TEMPLATE_SLUG_REFEREE_COMMISSION_EARNING,
                [
                    'REFERRER_NAME' => $event->order->user->referredBy->first_name,
                    'REDIRECT_URL' => config('app.url') . '/dashboard/referral-program/referrals',
                ]
            );
        }
    }

    protected function processSalesmanCommission(OrderPaid $event): void
    {
        if ($event->order->salesman()->exists()) {
            SalesmanCommissionService::onOrderLine($event->order, CommissionEarnedEnum::ORDER_CREATED);
        }
    }

    protected function processReferrerCommission(OrderPaid $event): void
    {
        ReferrerCommissionService::processOrderReferralCommissions($event->order);
    }

    protected function processOrderAbandoned(OrderPaid $event): void
    {
        $event->order->detachTag('abandoned');
    }
}
