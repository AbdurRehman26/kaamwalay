<?php

namespace App\Listeners\API\ReferralProgram\Referee;

use App\Events\API\Auth\CustomerRegistered;
use App\Services\EmailService;
use App\Services\ReferralProgram\RefereeCouponService;
use Illuminate\Contracts\Queue\ShouldBeEncrypted;

class CreateRefereeCoupon implements ShouldBeEncrypted
{
    public function __construct(protected RefereeCouponService $refereeCouponService, protected EmailService $emailService)
    {
    }

    public function handle(CustomerRegistered $event): void
    {
        if ($event->user->referredBy) {
            $coupon = $this->refereeCouponService->createRefereeCoupon($event->user);

            $this->emailService->sendEmail(
                [[$event->user->email => $event->user->first_name ?? '']],
                EmailService::SUBJECT[EmailService::TEMPLATE_SLUG_REFEREE_DISCOUNT_CODE],
                EmailService::TEMPLATE_SLUG_REFEREE_DISCOUNT_CODE,
                [
                    'REDIRECT_URL' => config('app.url').'/dashboard/submissions/new?coupon='.$coupon->code,
                    'PERCENTAGE_VALUE' => config('robograding.feature_referral_discount_percentage'),
                    'DISCOUNT_PROMO_CODE' => $coupon->code,
                ]
            );
        }
    }
}
