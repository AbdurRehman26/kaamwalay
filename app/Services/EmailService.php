<?php

namespace App\Services;

use App\Jobs\Email\SendEmail;
use App\Jobs\Email\SendScheduledEmail;
use App\Models\ScheduledEmail;
use DateTime;

class EmailService
{
    public const TEMPLATE_SLUG_CUSTOMER_WELCOME = 'customer-welcome-robograding';
    public const TEMPLATE_SLUG_SUBMISSION_PLACED = 'customer-confirmation-robograding';
    public const TEMPLATE_SLUG_SUBMISSION_ARRIVED = 'arrived-robograding';
    public const TEMPLATE_SLUG_SUBMISSION_SHIPPED = 'shipped-robograding';
    public const TEMPLATE_SLUG_SUBMISSION_GRADED = 'graded-robograding-1';
    public const TEMPLATE_SLUG_FORGOT_PASSWORD = 'reset-password-robograding';
    public const TEMPLATE_PASSWORD_CHANGED = 'new-password-confirmation-robograding';
    public const TEMPLATE_SLUG_CUSTOMER_SHIPMENT_TRACKING_REMINDER = 'enter-tracking-robograding';

    public const SUBJECT = [
        self::TEMPLATE_SLUG_CUSTOMER_WELCOME => 'Welcome to Robograding!',
        self::TEMPLATE_SLUG_SUBMISSION_PLACED => 'Submission Placed!',
        self::TEMPLATE_SLUG_SUBMISSION_ARRIVED => 'Your submission has arrived!',
        self::TEMPLATE_SLUG_SUBMISSION_SHIPPED => 'Your cards have shipped!',
        self::TEMPLATE_SLUG_SUBMISSION_GRADED => 'Your cards have been graded',
        self::TEMPLATE_SLUG_FORGOT_PASSWORD => 'Reset your password!',
        self::TEMPLATE_PASSWORD_CHANGED => 'Your password has been changed!',
        self::TEMPLATE_SLUG_CUSTOMER_SHIPMENT_TRACKING_REMINDER => 'Enter a tracking number!',
    ];

    /**
     * Send email using a template. It automatically sends email to queue for background processing.
     *
     * @param  string  $recipientEmail
     * @param  string  $recipientName
     * @param  string  $subject
     * @param  string  $templateName
     * @param  array  $templateContent
     */
    public function sendEmail(
        string $recipientEmail,
        string $recipientName,
        string $subject,
        string $templateName,
        array $templateContent = []
    ): void {
        if (app()->environment('local')) {
            return;
        }
        SendEmail::dispatch($recipientEmail, $recipientName, $subject, $templateName, $templateContent);
    }

    /**
     * Schedule email for sending later. Email will be sent later at specified time.
     *
     * @param  DateTime  $sendAt
     * @param  string  $recipientEmail
     * @param  string  $recipientName
     * @param  string  $subject
     * @param  string  $templateName
     * @param  array  $templateContent
     *
     * @return bool
     */
    public function scheduleEmail(
        DateTime $sendAt,
        string $recipientEmail,
        string $recipientName,
        string $subject,
        string $templateName,
        array $templateContent = []
    ): bool {
        if (app()->environment('local')) {
            return true;
        }
        
        ScheduledEmail::create([
            'send_at' => $sendAt,
            'payload' => serialize([
                'recipientEmail' => $recipientEmail,
                'recipientName' => $recipientName,
                'subject' => $subject,
                'templateName' => $templateName,
                'templateContent' => $templateContent,
            ]),
        ]);

        return true;
    }

    public function processScheduledEmails(): void
    {
        if (app()->environment('local')) {
            return;
        }

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
