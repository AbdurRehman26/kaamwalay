<?php

namespace App\Console\Commands;

use App\Services\Mailchimp\SendCustomersToMailchimpServices;
use Illuminate\Console\Command;

class SendOrderPaidCustomersToMailchimp extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sync:order-paid-customers';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync Order Paid Customers to Mailchimp';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle(SendCustomersToMailchimpServices $mailChimpService)
    {
        $mailChimpService->createListOnMailchimp(SendCustomersToMailchimpServices::TEMPLATE_ORDER_PAID_CUSTOMERS);

        return 0;
    }
}
