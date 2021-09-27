<?php

namespace App\Jobs\Email;

use App\Http\APIClients\MandrillClient;
use App\Models\ScheduledEmail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendScheduledEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected const QUEUE_NAME = 'emails';

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
     */
    public function handle(MandrillClient $mandrillClient)
    {
        $payload = unserialize($this->scheduledEmail->payload);

        $mandrillClient->sendEmailWithTemplate(
            $payload['recipientEmail'],
            $payload['recipientName'],
            $payload['subject'],
            $payload['templateName'],
            $payload['templateContent']
        );

        $this->scheduledEmail->is_sent = 1;
        $this->scheduledEmail->save();
    }
}
