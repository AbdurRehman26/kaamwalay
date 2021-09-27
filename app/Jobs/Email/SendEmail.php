<?php

namespace App\Jobs\Email;

use App\Http\APIClients\MandrillClient;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected const QUEUE_NAME = 'emails';

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(
        protected string $recipientEmail,
        protected string $recipientName,
        protected string $subject,
        protected string $templateName,
        protected array $templateContent = []
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
        $mandrillClient->sendEmailWithTemplate(
            $this->recipientEmail,
            $this->recipientName,
            $this->subject,
            $this->templateName,
            $this->templateContent
        );
    }
}
