<?php

namespace App\Console\Commands\Mailchimp;

use App\Services\Mailchimp\SendCustomersToMailchimpService;
use Illuminate\Console\Command;

class SendOrderPaidCustomersToMailchimp extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mailchimp:sync-order-paid-customers';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync Order Paid Customers to Mailchimp';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle(SendCustomersToMailchimpService $mailChimpService)
    {
        $mailChimpService->sendExistingOrderPaidCustomersToMailchimp(SendCustomersToMailchimpService::LIST_NAME_ORDER_PAID_CUSTOMERS);

        return 0;
    }
}
