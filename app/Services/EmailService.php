<?php

namespace App\Services;

use App\Jobs\Email\SendEmail;
use App\Jobs\Email\SendScheduledEmail;
use App\Models\ScheduledEmail;
use DateTime;

class EmailService
{
    /* Transactional Start */
    public const TEMPLATE_SLUG_CUSTOMER_WELCOME = 'customer-welcome-robograding';
    public const TEMPLATE_SLUG_SUBMISSION_PLACED = 'customer-confirmation-robograding';
    public const TEMPLATE_SLUG_SUBMISSION_CONFIRMED = 'confirmed-robograding';
    public const TEMPLATE_SLUG_SUBMISSION_SHIPPED = 'shipped-robograding';
    public const TEMPLATE_SLUG_SUBMISSION_GRADED = 'graded-robograding-1';
    public const TEMPLATE_SLUG_CUSTOMER_SUBMISSION_REFUNDED = 'refund-robograding';
    public const TEMPLATE_SLUG_FORGOT_PASSWORD = 'reset-password-robograding';
    public const TEMPLATE_PASSWORD_CHANGED = 'new-password-confirmation-robograding';
    public const TEMPLATE_SLUG_CUSTOMER_SHIPMENT_TRACKING_REMINDER = 'enter-tracking-robograding';
    public const TEMPLATE_SLUG_CUSTOMER_SUBMISSION_EXTRA_CHARGED = 'extra-charge-robograding';
    public const TEMPLATE_SLUG_ADMIN_SUBMISSION_PLACED = 'admin-new-submission-robograding';
    public const TEMPLATE_CUSTOMER_PAYMENT_DUE_REMINDER = 'payment-due';
    public const TEMPLATE_SLUG_CUSTOMER_ORDER_PAID = 'payment-confirmation';
    public const TEMPLATE_SLUG_SUBMISSION_IN_VAULT = 'customer-stored-in-vault';
    public const TEMPLATE_SLUG_SHIPPED_FROM_VAULT = 'shipped-from-vault';
    /* Transactional End */

    /* Marketing Start */
    public const TEMPLATE_SLUG_MARKETING_REGISTERED_WHAT_HAPPENED = 'robograding-what-happened';
    public const TEMPLATE_SLUG_MARKETING_REGISTERED_NOT_SURE_YET = 'robograding-not-sure-yet';
    public const TEMPLATE_SLUG_MARKETING_REGISTERED_CARD_SELL_FOR = 'robograding-card-sell-for';
    public const TEMPLATE_SLUG_MARKETING_REGISTERED_YOU_WILL_LOVE_US = 'robograding-you-will-love-us';
    public const TEMPLATE_SLUG_MARKETING_SWITCH_TO_ROBOGRADING = 'robograding-switch-to-robograding';
    public const TEMPLATE_SLUG_MARKETING_REGISTERED_PRICE_HOLDING_BACK = 'robograding-price-holding-back';
    public const TEMPLATE_SLUG_MARKETING_REGISTERED_FAIR_PRICES = 'robograding-fair-prices';
    public const TEMPLATE_SLUG_MARKETING_REGISTERED_SUBMIT_WITH_AGS = 'robograding-how-to-submit-to-ags';
    public const TEMPLATE_SLUG_MARKETING_REGISTERED_DONT_WASTE_MONEY = 'robograding-dont-waste-your-money';
    public const TEMPLATE_SLUG_MARKETING_ORDER_HOW_DID_IT_GO = 'robograding-ordered-how-did-it-go';
    public const TEMPLATE_SLUG_MARKETING_ORDER_SUPER_SIMPLE_GRADING = 'robograding-ordered-super-simple-grading';
    public const TEMPLATE_SLUG_MARKETING_ORDER_FAIR_VALUE_GRADE = 'robograding-ordered-fair-value-grade';
    public const TEMPLATE_SLUG_MARKETING_ORDER_GOT_VALUEABLE_CARDS = 'robograding-ordered-got-valueable-cards';
    public const TEMPLATE_SLUG_MARKETING_ORDER_LIKE_GRADING_WITH_US = 'robograding-ordered-like-grading-with-us';
    /* Marketing End */

    public const SUBJECT = [
        self::TEMPLATE_SLUG_CUSTOMER_WELCOME => 'Welcome to Robograding!',
        self::TEMPLATE_SLUG_SUBMISSION_PLACED => 'Submission Placed!',
        self::TEMPLATE_SLUG_SUBMISSION_CONFIRMED => 'Your submission is confirmed!',
        self::TEMPLATE_SLUG_SUBMISSION_SHIPPED => 'Your cards have shipped!',
        self::TEMPLATE_SLUG_SUBMISSION_GRADED => 'Your cards have been graded',
        self::TEMPLATE_SLUG_FORGOT_PASSWORD => 'Reset your password!',
        self::TEMPLATE_PASSWORD_CHANGED => 'Your password has been changed!',
        self::TEMPLATE_SLUG_CUSTOMER_SHIPMENT_TRACKING_REMINDER => 'Enter a tracking number!',
        self::TEMPLATE_SLUG_CUSTOMER_SUBMISSION_REFUNDED => 'We have issued a refund on your submission.',
        self::TEMPLATE_SLUG_CUSTOMER_SUBMISSION_EXTRA_CHARGED => 'There has been an extra charge on your submission.',
        self::TEMPLATE_SLUG_ADMIN_SUBMISSION_PLACED => 'New Robograding Submission!',
        self::TEMPLATE_CUSTOMER_PAYMENT_DUE_REMINDER => 'Your Payment is Due!',
        self::TEMPLATE_SLUG_CUSTOMER_ORDER_PAID => 'Thank you for your payment!',
        self::TEMPLATE_SLUG_SUBMISSION_IN_VAULT => 'Your cards are in AGS Vault!',
        self::TEMPLATE_SLUG_SHIPPED_FROM_VAULT => 'Your cards have shipped from AGS Vault!',

        self::TEMPLATE_SLUG_MARKETING_REGISTERED_WHAT_HAPPENED => 'What happened?',
        self::TEMPLATE_SLUG_MARKETING_REGISTERED_NOT_SURE_YET => 'Not sure yet?',
        self::TEMPLATE_SLUG_MARKETING_REGISTERED_CARD_SELL_FOR => 'Not sure how much your cards will sell for?',
        self::TEMPLATE_SLUG_MARKETING_REGISTERED_YOU_WILL_LOVE_US => 'This is why you\'ll love us',
        self::TEMPLATE_SLUG_MARKETING_SWITCH_TO_ROBOGRADING => "Why switch to RoboGrading",
        self::TEMPLATE_SLUG_MARKETING_REGISTERED_PRICE_HOLDING_BACK => 'Is the price holding you back?',
        self::TEMPLATE_SLUG_MARKETING_REGISTERED_FAIR_PRICES => 'Our prices are fair but you still want a deal!',
        self::TEMPLATE_SLUG_MARKETING_REGISTERED_SUBMIT_WITH_AGS => 'How to submit your cards with AGS',
        self::TEMPLATE_SLUG_MARKETING_REGISTERED_DONT_WASTE_MONEY => 'Don\'t waste your money',
        self::TEMPLATE_SLUG_MARKETING_ORDER_HOW_DID_IT_GO => 'How did it go?',
        self::TEMPLATE_SLUG_MARKETING_ORDER_SUPER_SIMPLE_GRADING => 'Grading should be super simple',
        self::TEMPLATE_SLUG_MARKETING_ORDER_FAIR_VALUE_GRADE => 'Not sure if you\'ll get the fair value for your cards?',
        self::TEMPLATE_SLUG_MARKETING_ORDER_GOT_VALUEABLE_CARDS => 'Got valuable cards?',
        self::TEMPLATE_SLUG_MARKETING_ORDER_LIKE_GRADING_WITH_US => 'What is it like grading with AGS?',
    ];

    /**
     * Send email using a template. It automatically sends email to queue for background processing.
     *
     * @param  array  $recipients
     * @param  string  $subject
     * @param  string  $templateName
     * @param  array  $templateContent
     */
    public function sendEmail(
        array $recipients,
        string $subject,
        string $templateName,
        array $templateContent = []
    ): void {
        // if (app()->environment('local')) {
        //     return;
        // }

        SendEmail::dispatch($recipients, $subject, $templateName, $templateContent);
    }

    /**
     * Schedule email for sending later. Email will be sent later at specified time.
     *
     * @param  DateTime  $sendAt
     * @param  array  $recipients
     * @param  string  $subject
     * @param  string  $templateName
     * @param  array  $templateContent
     * @param  bool  $reschedulingRequired
     * @param  string|null  $checkClass
     * @param  array  $extraData
     * @return bool
     */
    public function scheduleEmail(
        DateTime $sendAt,
        array $recipients,
        string $subject,
        string $templateName,
        array $templateContent = [],
        bool $reschedulingRequired = false,
        string $checkClass = null,
        array $extraData = [],
    ): bool {
        if (app()->environment('local')) {
            return true;
        }

        ScheduledEmail::create([
            'send_at' => $sendAt,
            'payload' => serialize([
                'recipients' => $recipients,
                'subject' => $subject,
                'templateName' => $templateName,
                'templateContent' => $templateContent,
            ]),
            'rescheduling_required' => $reschedulingRequired,
            'check_class' => $checkClass,
            'extra_data' => serialize($extraData),
        ]);

        return true;
    }

    public function processScheduledEmails(): void
    {
        ScheduledEmail::where('send_at', '<=', now())->where('is_sent', 0)->each(function (
            ScheduledEmail $scheduledEmail
        ) {
            SendScheduledEmail::dispatch($scheduledEmail);
        });
    }

    /**
     * Get predefined subject based on template.
     *
     * @param  string  $template
     *
     * @return string
     */
    public function getSubjectByTemplate(string $template): string
    {
        return self::SUBJECT[$template];
    }
}
