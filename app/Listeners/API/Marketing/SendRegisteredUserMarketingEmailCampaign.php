<?php

namespace App\Listeners\API\Marketing;

use App\Events\API\Auth\CustomerRegistered;
use App\Services\EmailService;
use Illuminate\Contracts\Queue\ShouldBeEncrypted;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendRegisteredUserMarketingEmailCampaign implements ShouldQueue, ShouldBeEncrypted
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

    public function handle(CustomerRegistered $event): void
    {
        $user = $event->user;
        $userEmail = $user->email;
        $userFirstName = $user->first_name ?? '';

        $this->emailService->scheduleEmail(
            now()->addDay(),
            [[$userEmail => $userFirstName]],
            EmailService::SUBJECT[EmailService::TEMPLATE_SLUG_MARKETING_REGISTERED_WHAT_HAPPENED],
            EmailService::TEMPLATE_SLUG_MARKETING_REGISTERED_WHAT_HAPPENED,
            [],
            false,
            'RegisteredUserMarketingEmailCampaignCheck',
            ['user_id' => $user->id]
        );

        $this->emailService->scheduleEmail(
            now()->addDays(2),
            [[$userEmail => $userFirstName]],
            EmailService::SUBJECT[EmailService::TEMPLATE_SLUG_MARKETING_REGISTERED_NOT_SURE_YET],
            EmailService::TEMPLATE_SLUG_MARKETING_REGISTERED_NOT_SURE_YET,
            [],
            false,
            'RegisteredUserMarketingEmailCampaignCheck',
            ['user_id' => $user->id]
        );

        $this->emailService->scheduleEmail(
            now()->addDays(3),
            [[$userEmail => $userFirstName]],
            EmailService::SUBJECT[EmailService::TEMPLATE_SLUG_MARKETING_REGISTERED_CARD_SELL_FOR],
            EmailService::TEMPLATE_SLUG_MARKETING_REGISTERED_CARD_SELL_FOR,
            [],
            false,
            'RegisteredUserMarketingEmailCampaignCheck',
            ['user_id' => $user->id]
        );

        $this->emailService->scheduleEmail(
            now()->addDays(4),
            [[$userEmail => $userFirstName]],
            EmailService::SUBJECT[EmailService::TEMPLATE_SLUG_MARKETING_REGISTERED_YOU_WILL_LOVE_US],
            EmailService::TEMPLATE_SLUG_MARKETING_REGISTERED_YOU_WILL_LOVE_US,
            [],
            false,
            'RegisteredUserMarketingEmailCampaignCheck',
            ['user_id' => $user->id]
        );

        $this->emailService->scheduleEmail(
            now()->addDays(5),
            [[$userEmail => $userFirstName]],
            EmailService::SUBJECT[EmailService::TEMPLATE_SLUG_MARKETING_SWITCH_TO_ROBOGRADING],
            EmailService::TEMPLATE_SLUG_MARKETING_SWITCH_TO_ROBOGRADING,
            [],
            false,
            'RegisteredUserMarketingEmailCampaignCheck',
            ['user_id' => $user->id]
        );

        $this->emailService->scheduleEmail(
            now()->addDays(6),
            [[$userEmail => $userFirstName]],
            EmailService::SUBJECT[EmailService::TEMPLATE_SLUG_MARKETING_REGISTERED_PRICE_HOLDING_BACK],
            EmailService::TEMPLATE_SLUG_MARKETING_REGISTERED_PRICE_HOLDING_BACK,
            [],
            false,
            'RegisteredUserMarketingEmailCampaignCheck',
            ['user_id' => $user->id]
        );

        $this->emailService->scheduleEmail(
            now()->addDays(7),
            [[$userEmail => $userFirstName]],
            EmailService::SUBJECT[EmailService::TEMPLATE_SLUG_MARKETING_REGISTERED_FAIR_PRICES],
            EmailService::TEMPLATE_SLUG_MARKETING_REGISTERED_FAIR_PRICES,
            [],
            false,
            'RegisteredUserMarketingEmailCampaignCheck',
            ['user_id' => $user->id]
        );

        $this->emailService->scheduleEmail(
            now()->addDays(8),
            [[$userEmail => $userFirstName]],
            EmailService::SUBJECT[EmailService::TEMPLATE_SLUG_MARKETING_REGISTERED_SUBMIT_WITH_AGS],
            EmailService::TEMPLATE_SLUG_MARKETING_REGISTERED_SUBMIT_WITH_AGS,
            [],
            false,
            'RegisteredUserMarketingEmailCampaignCheck',
            ['user_id' => $user->id]
        );

        $this->emailService->scheduleEmail(
            now()->addDays(9),
            [[$userEmail => $userFirstName]],
            EmailService::SUBJECT[EmailService::TEMPLATE_SLUG_MARKETING_REGISTERED_DONT_WASTE_MONEY],
            EmailService::TEMPLATE_SLUG_MARKETING_REGISTERED_DONT_WASTE_MONEY,
            [],
            false,
            'RegisteredUserMarketingEmailCampaignCheck',
            ['user_id' => $user->id]
        );
    }
}
