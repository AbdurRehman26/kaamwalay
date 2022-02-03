<?php

namespace App\Console\Commands\Mailchimp;

use App\Services\Mailchimp\SendCustomersToMailchimpService;
use Illuminate\Console\Command;

class CreateListsOnMailchimp extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mailchimp:create-lists';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create list on mailchimp';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle(SendCustomersToMailchimpService $mailChimpService)
    {
        $lists = [
          SendCustomersToMailchimpService::LIST_NAME_SIGN_UP_USERS,
          SendCustomersToMailchimpService::LIST_NAME_ORDER_PAID_CUSTOMERS,
        ];

        $mailChimpService->createListOnMailchimp($lists);

        return 0;
    }
}
