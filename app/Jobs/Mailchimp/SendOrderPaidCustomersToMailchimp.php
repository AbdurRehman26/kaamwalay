<?php

namespace App\Jobs\Mailchimp;

use App\Models\User;
use App\Services\Mailchimp\SendCustomersToMailchimpService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendOrderPaidCustomersToMailchimp implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(
        protected User $user
    ) {
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle(SendCustomersToMailchimpService $mailChimpService)
    {
        $mailChimpService->sendNewUsers($this->user, SendCustomersToMailchimpService::TEMPLATE_ORDER_PAID_CUSTOMERS);
    }
}
