<?php

namespace App\Listeners\API\Order\V2;

use App\Enums\Referrer\CommissionEarnedEnum as ReferrerCommissionEarnedEnum;
use App\Enums\Salesman\CommissionEarnedEnum;
use App\Events\API\Customer\Order\OrderPaid;
use App\Models\CommissionStructure;
use App\Services\EmailService;
use App\Services\Order\V2\OrderService;
use App\Services\ReferrerCommission\ReferrerCommissionService;
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
     *
     * @param  OrderPaid  $event
     * @return void
     */
    public function handle(OrderPaid $event): void
    {
        $this->processEmails($event);
        $this->processSalesmanCommission($event);
        $this->processReferrerCommission($event);
    }

    protected function processEmails(OrderPaid $event): void
    {
        $this->emailService->sendEmail(
            [[$event->order->user->email => $event->order->user->getFullName()]],
            $this->emailService->getSubjectByTemplate(EmailService::TEMPLATE_SLUG_CUSTOMER_ORDER_PAID),
            EmailService::TEMPLATE_SLUG_CUSTOMER_ORDER_PAID,
            $this->orderService->getDataForCustomerOrderPaid($event->order)
        );
    }

    protected function processSalesmanCommission(OrderPaid $event): void
    {
        if ($event->order->salesman()->exists()) {
            SalesmanCommissionService::onOrderLine($event->order, CommissionEarnedEnum::ORDER_CREATED);
        }
    }

    protected function processReferrerCommission(OrderPaid $event): void
    {
        if ($event->order->user->referredBy()->exists()) {
            $level1Structure = CommissionStructure::where('level', 1)->first();
            ReferrerCommissionService::onOrderLine($event->order, $event->order->user->referredBy, $level1Structure, ReferrerCommissionEarnedEnum::ORDER_PAID);
        }
    }
}
