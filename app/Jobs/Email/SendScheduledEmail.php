<?php

namespace App\Jobs\Email;

use App\Http\APIClients\MandrillClient;
use App\Models\ScheduledEmail;
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
        $payload = unserialize($this->scheduledEmail->payload);

        $response = $mandrillClient->sendEmailWithTemplate(
            $payload['recipientEmail'],
            $payload['recipientName'],
            $payload['subject'],
            $payload['templateName'],
            $payload['templateContent']
        );

        $status = $response->json()[0]['status'];

        if (empty($status) || $status !== 'sent') {
            throw new Exception('Email could not be sent. Response: ' . $response->body());
        }

        $this->scheduledEmail->is_sent = 1;
        $this->scheduledEmail->save();
    }
}
