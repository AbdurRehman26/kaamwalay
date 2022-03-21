<?php

namespace App\Console\Commands\Mailchimp;

use App\Services\MailchimpService;
use Illuminate\Console\Command;

class DeleteDuplicateUsersInMailchimpLists extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mailchimp:delete-duplicate-users';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete duplicate users in Mailchimp lists';

    /**
     * Execute the console command.
     *
     * @param  MailchimpService  $mailchimpService
     * @return int
     */
    public function handle(MailchimpService $mailchimpService): int
    {
        $mailchimpService->deleteDuplicateUsersBetweenLists(MailchimpService::LIST_NAME_ORDER_PAID_CUSTOMERS, MailchimpService::LIST_NAME_SIGN_UP_USERS);

        return 0;
    }
}
