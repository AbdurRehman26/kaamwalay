<?php

namespace App\Console\Commands\Mailchimp;

use App\Services\MailchimpService;
use Illuminate\Console\Command;

class SyncUsersToMailchimp extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mailchimp:sync-users';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync Users to Mailchimp';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle(MailchimpService $mailChimpService)
    {
        $mailChimpService->sendExistingUsersToMailchimp(MailchimpService::LIST_NAME_SIGN_UP_USERS);

        return 0;
    }
}
