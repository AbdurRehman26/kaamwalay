<?php

namespace App\Jobs\Email;

use App\Http\APIClients\MandrillClient;
use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendEmail implements ShouldQueue
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
        protected array $recipients,
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
     * @throws Exception
     */
    public function handle(MandrillClient $mandrillClient)
    {
        $response = $mandrillClient->sendEmailWithTemplate(
            $this->recipients,
            $this->subject,
            $this->templateName,
            $this->templateContent
        );

        if (! empty($response->json()[0]['status'])) {
            $status = $response->json()[0]['status'];
        }

        if (empty($status)) {
            throw new Exception('Email could not be sent. Response: ' . $response->body());
        }
    }
}
