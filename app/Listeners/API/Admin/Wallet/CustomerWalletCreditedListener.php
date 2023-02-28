<?php

namespace App\Listeners\API\Admin\Wallet;

use App\Events\API\Admin\Wallet\CustomerWalletCredited;
use App\Services\EmailService;
use Illuminate\Contracts\Queue\ShouldQueue;

class CustomerWalletCreditedListener implements ShouldQueue
{
    public bool $afterCommit = true;

    public function __construct(protected EmailService $emailService)
    {
        //
    }

    public function handle(CustomerWalletCredited $event): void
    {
        $wallet = $event->wallet;
        $user = $wallet->user;

        $this->emailService->sendEmail(
            [[$user->email => $user->name]],
            $this->emailService::SUBJECT[$this->emailService::TEMPLATE_SLUG_CUSTOMER_SUBMISSION_REFUNDED],
            $this->emailService::TEMPLATE_SLUG_CUSTOMER_SUBMISSION_REFUNDED,
            [
                'REFUNDED_AMOUNT' => number_format($event->data['amount'], 2),
            ],
        );
    }
}
