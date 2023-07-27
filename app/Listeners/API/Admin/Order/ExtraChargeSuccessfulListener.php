<?php

namespace App\Listeners\API\Admin\Order;

use App\Enums\Salesman\CommissionEarnedEnum;
use App\Events\API\Admin\Order\ExtraChargeSuccessful;
use App\Http\Resources\API\V2\Customer\Order\OrderPaymentResource;
use App\Services\EmailService;
use App\Services\SalesmanCommission\SalesmanCommissionService;
use Illuminate\Contracts\Queue\ShouldQueue;

class ExtraChargeSuccessfulListener implements ShouldQueue
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct(protected EmailService $emailService)
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(ExtraChargeSuccessful $event): void
    {
        $this->processEmails($event);
        $this->processSalesmanCommission($event);
    }

    protected function processEmails(ExtraChargeSuccessful $event): void
    {
        $orderPayment = new OrderPaymentResource($event->order->lastOrderPayment);
        $order = $event->order;
        $user = $order->user;
        $card = json_decode(json_encode($orderPayment), true)['card'];

        $this->emailService->sendEmail(
            [[$user->email => $user->name]],
            $this->emailService::SUBJECT[$this->emailService::TEMPLATE_SLUG_CUSTOMER_SUBMISSION_EXTRA_CHARGED],
            $this->emailService::TEMPLATE_SLUG_CUSTOMER_SUBMISSION_EXTRA_CHARGED,
            [
                'ORDER_NUMBER' => $order->order_number,
                'TOTAL_AMOUNT' => number_format(($order->grand_total - $order->amount_paid_from_wallet), 2),
                'SUB_TOTAL' => number_format($order->service_fee, 2),
                'SHIPPING_FEE' => number_format($order->shipping_fee, 2),
                'INSURANCE_FEE' => $order->shipping_insurance_fee ? '$'.number_format($order->shipping_insurance_fee, 2) : 'N/A',
                'EXTRA_CHARGE' => number_format($orderPayment->amount, 2),
                'EXTRA_CHARGE_TOTAL' => number_format($order->extra_charge_total, 2),
                'REFUNDED_AMOUNT_TOTAL' => $order->refund_total ? '-$'.number_format($order->refund_total, 2) : 'N/A',
                'NOTES' => $orderPayment->notes,
                'CARD' => $card ? ($card['brand'].' ending in '.$card['last4']) : 'N/A',
                'SUBMISSION_URL' => config('app.url').'/dashboard/submissions/'.$order->id.'/view',
            ],
        );
    }

    protected function processSalesmanCommission(ExtraChargeSuccessful $event): void
    {
        if ($event->order->salesman()->exists() && $event->order->salesman->salesmanProfile->hasCommissionTypePercentage()) {
            SalesmanCommissionService::onOrderLine($event->order, CommissionEarnedEnum::ORDER_EXTRA_CHARGE);
        }
    }
}
