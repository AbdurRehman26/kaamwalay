<?php

namespace App\Jobs\Email;

use App\Http\APIClients\MandrillClient;
use App\Models\ScheduledEmail;
use App\Services\Email\CheckInterface;
use App\Services\Email\ReschedulingCheckInterface;
use App\Services\Email\ShouldStillSendCheckInterface;
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

    protected CheckInterface $checkClass;

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
        if (! empty($this->scheduledEmail->check_class)) {
            $checkClass = $this->getCheckClass();

            if ($checkClass instanceof ShouldStillSendCheckInterface) {
                if (! $checkClass->shouldStillSend($this->scheduledEmail)) {
                    $this->scheduledEmail->is_sent = 1;
                    $this->scheduledEmail->save();

                    return;
                }
            }
        }

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
            $checkClass = $this->getCheckClass();

            if (! $checkClass instanceof ReschedulingCheckInterface) {
                throw new Exception('Check class needs to implement correct interface.');
            }

            if (! $checkClass->needsRescheduling($this->scheduledEmail)) {
                return;
            }

            $scheduledEmail = $this->scheduledEmail->replicate();
            $scheduledEmail->send_at = $checkClass->getNextSendAt($this->scheduledEmail);
            $scheduledEmail->is_sent = 0;
            $scheduledEmail->save();
        }
    }

    protected function getCheckClass(): CheckInterface
    {
        if (! empty($this->checkClass)) {
            return $this->checkClass;
        }

        $className = 'App\\Services\\Email\\Check\\' . $this->scheduledEmail->check_class;

        return $this->checkClass = new $className;
    }
}
