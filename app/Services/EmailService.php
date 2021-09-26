<?php

namespace App\Services;

use App\Jobs\SendEmail;
use App\Models\ScheduledEmail;
use DateTime;
use Exception;
use Illuminate\Support\Facades\Log;

class EmailService
{
    public const TEMPLATE_SLUG_CUSTOMER_WELCOME = 'customer-welcome-robograding';
    public const SUBJECT = [
        self::TEMPLATE_SLUG_CUSTOMER_WELCOME => 'Welcome to Robograding!'
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

    public function processScheduledEmails(): bool
    {
        ScheduledEmail::where('send_at', '<=', now())->where('is_sent', 0)->each(function (ScheduledEmail $scheduledEmail) {
            $this->processScheduledEmail($scheduledEmail);
        });

        return true;
    }

    public function processScheduledEmail(ScheduledEmail $scheduledEmail): bool
    {
        $payload = unserialize($scheduledEmail->payload);

        try {
            SendEmail::dispatch(
                $payload['recipientEmail'],
                $payload['recipientName'],
                $payload['subject'],
                $payload['templateName'],
                $payload['templateContent']
            );

            $scheduledEmail->is_sent = 1;
            $scheduledEmail->save();

            return true;
        } catch (Exception $e) {
            Log::error($e->getMessage());

            return false;
        }
    }
}
