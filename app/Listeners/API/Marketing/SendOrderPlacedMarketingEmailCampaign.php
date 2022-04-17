<?php

namespace App\Listeners\API\Marketing;

use App\Events\API\Customer\Order\OrderPlaced;
use App\Services\EmailService;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendOrderPlacedMarketingEmailCampaign implements ShouldQueue
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

    public function handle(OrderPlaced $event): void
    {
        if (app()->environment('local')) {
            return;
        }

        $user = $event->order->user;
        $userEmail = $user->email;
        $userFirstName = $user->first_name ?? '';

        $this->emailService->scheduleEmail(
            now()->addDay(),
            [[$userEmail => $userFirstName]],
            EmailService::SUBJECT[EmailService::TEMPLATE_SLUG_MARKETING_ORDER_HOW_DID_IT_GO],
            EmailService::TEMPLATE_SLUG_MARKETING_ORDER_HOW_DID_IT_GO
        );

        $this->emailService->scheduleEmail(
            now()->addDays(2),
            [[$userEmail => $userFirstName]],
            EmailService::SUBJECT[EmailService::TEMPLATE_SLUG_MARKETING_ORDER_SUPER_SIMPLE_GRADING],
            EmailService::TEMPLATE_SLUG_MARKETING_ORDER_SUPER_SIMPLE_GRADING
        );

        $this->emailService->scheduleEmail(
            now()->addDays(3),
            [[$userEmail => $userFirstName]],
            EmailService::SUBJECT[EmailService::TEMPLATE_SLUG_MARKETING_ORDER_FAIR_VALUE_GRADE],
            EmailService::TEMPLATE_SLUG_MARKETING_ORDER_FAIR_VALUE_GRADE
        );

        $this->emailService->scheduleEmail(
            now()->addDays(4),
            [[$userEmail => $userFirstName]],
            EmailService::SUBJECT[EmailService::TEMPLATE_SLUG_MARKETING_ORDER_GOT_VALUEABLE_CARDS],
            EmailService::TEMPLATE_SLUG_MARKETING_ORDER_GOT_VALUEABLE_CARDS
        );

        $this->emailService->scheduleEmail(
            now()->addDays(5),
            [[$userEmail => $userFirstName]],
            EmailService::SUBJECT[EmailService::TEMPLATE_SLUG_MARKETING_SWITCH_TO_ROBOGRADING],
            EmailService::TEMPLATE_SLUG_MARKETING_SWITCH_TO_ROBOGRADING
        );

        $this->emailService->scheduleEmail(
            now()->addDays(6),
            [[$userEmail => $userFirstName]],
            EmailService::SUBJECT[EmailService::TEMPLATE_SLUG_MARKETING_ORDER_LIKE_GRADING_WITH_US],
            EmailService::TEMPLATE_SLUG_MARKETING_ORDER_LIKE_GRADING_WITH_US
        );
    }
}
