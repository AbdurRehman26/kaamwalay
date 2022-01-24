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
    protected $signature = 'users:create-list-on-mailchimp';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create list on mailchimp';

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
        $list = [
          SendCustomersToMailchimpService::LIST_NAME_SIGN_UP_USERS,
          SendCustomersToMailchimpService::LIST_NAME_ORDER_PAID_CUSTOMERS,
        ];
        $mailChimpService->createListOnMailchimp($list);

        return 0;
    }
}
