<?php

namespace App\Listeners\API\Admin\Wallet;

use App\Events\API\Admin\Wallet\CustomerWalletCredited;
use App\Services\EmailService;
use Illuminate\Contracts\Queue\ShouldQueue;

class CustomerWalletCreditedListener implements ShouldQueue
{
    public function __construct(protected EmailService $emailService)
    {
        //
    }

    public function handle(CustomerWalletCredited $event): void
    {
        $user = $event->wallet->user;

        $this->emailService->sendEmail(
            [[$user->email => $user->name]],
            $this->emailService::SUBJECT[$this->emailService::TEMPLATE_SLUG_WALLET_CREDITED],
            $this->emailService::TEMPLATE_SLUG_WALLET_CREDITED,
        );
    }
}
