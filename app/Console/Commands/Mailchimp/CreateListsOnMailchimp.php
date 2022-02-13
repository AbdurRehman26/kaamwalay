<?php

namespace App\Console\Commands\Mailchimp;

use App\Services\MailchimpService;
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
    public function handle(MailchimpService $mailchimpService)
    {
        $lists = [
            MailchimpService::LIST_NAME_SIGN_UP_USERS,
            MailchimpService::LIST_NAME_ORDER_PAID_CUSTOMERS,
        ];

        $mailchimpService->createListsOnMailchimp($lists);

        return 0;
    }
}
