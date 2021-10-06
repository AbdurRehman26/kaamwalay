<?php

namespace App\Listeners\API\Order;

use App\Events\API\Admin\Order\ExtraChargeApplied;
use App\Services\EmailService;

class SendExtraChargedEmail
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
     *
     * @param  ExtraChargeApplied  $event
     * @return void
     */
    public function handle(ExtraChargeApplied $event)
    {
        $order = $event->orderPayment->order;
        $user = $order->user;
        $this->emailService->sendEmail(
            $user->email,
            $user->name,
            $this->emailService::SUBJECT[$this->emailService::TEMPLATE_SLUG_SUBMISSION_EXTRA_CHARGED],
            $this->emailService::TEMPLATE_SLUG_SUBMISSION_EXTRA_CHARGED,
            [
                'TOTAL_AMOUNT' => $order->grand_total,
                'SUB_TOTAL' => 2,
                'SHIPPING_FEE' => $order->shipping_fee,
                'EXTRA_CHARGE' => $event->orderPayment->amount,
                'CARD' => 'Amex ending with 2020',
            ],
        );
        dd(1);
    }
}
