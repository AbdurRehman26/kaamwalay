<?php

namespace App\Listeners\API\Order;

use App\Events\API\Customer\Order\ExtraAmountCharged;
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
     * @param  ExtraAmountCharged  $event
     * @return void
     */
    public function handle(ExtraAmountCharged $event)
    {
        $user = $event->order->user;
        $this->emailService->sendEmail(
            $user->email,
            $user->name,
            $this->emailService::SUBJECT[$this->emailService::TEMPLATE_SLUG_SUBMISSION_EXTRA_CHARGED],
            $this->emailService::TEMPLATE_SLUG_SUBMISSION_EXTRA_CHARGED,
            [
                'TOTAL_AMOUNT' => 100,
                'SUB_TOTAL' => 2,
                'SHIPPING_FEE' => 1,
                'EXTRA_CHARGE' => 2,
                'CARD' => 'Amex ending with 2020',
            ],
        );
    }
}
