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
    protected $signature = 'users:sync-order-paid-customers-to-mailchimp';

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
    public function handle(SendCustomersToMailchimpService $mailChimpService)
    {
        $mailChimpService->sendExistingUsersToMailchimp(SendCustomersToMailchimpService::LIST_NAME_ORDER_PAID_CUSTOMERS);

        return 0;
    }
}
