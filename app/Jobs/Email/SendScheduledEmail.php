<?php

namespace App\Jobs\Email;

use App\Http\APIClients\MandrillClient;
use App\Models\ScheduledEmail;
use App\Services\Email\RescheduleEmailCheckInterface;
use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendScheduledEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected const QUEUE_NAME = 'emails';

    public $tries = 3;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(
        protected ScheduledEmail $scheduledEmail
    ) {
        $this->onQueue(self::QUEUE_NAME);
    }

    /**
     * Execute the job.
     *
     * @return void
     * @throws Exception
     */
    public function handle(MandrillClient $mandrillClient)
    {
        $this->processEmail($mandrillClient);
        $this->rescheduleEmail();
    }

    /**
     * @throws Exception
     */
    protected function processEmail(MandrillClient $mandrillClient): void
    {
        $payload = unserialize($this->scheduledEmail->payload);

        $response = $mandrillClient->sendEmailWithTemplate(
            $payload['recipients'],
            $payload['subject'],
            $payload['templateName'],
            $payload['templateContent']
        );

        if (! empty($response->json()[0]['status'])) {
            $status = $response->json()[0]['status'];
        }

        if (empty($status)) {
            throw new Exception('Email could not be sent. Response: ' . $response->body());
        }

        $this->scheduledEmail->is_sent = 1;
        $this->scheduledEmail->save();
    }

    /**
     * @throws Exception
     */
    protected function rescheduleEmail(): void
    {
        if ($this->scheduledEmail->reschedulingIsRequired()) {
            $className = 'App\\Services\\Email\\ReschedulingCheck\\' . $this->scheduledEmail->rescheduling_check_class;
            $reschedulingCheckClass = new $className;

            if (! $reschedulingCheckClass instanceof RescheduleEmailCheckInterface) {
                throw new Exception('Reschedule email needs to implement correct interface.');
            }

            if (! $reschedulingCheckClass->needsRescheduling($this->scheduledEmail)) {
                return;
            }

            $scheduledEmail = $this->scheduledEmail->replicate();
            $scheduledEmail->send_at = $reschedulingCheckClass->getNextSendAt($this->scheduledEmail);
            $scheduledEmail->is_sent = 0;
            $scheduledEmail->save();
        }
    }
}
