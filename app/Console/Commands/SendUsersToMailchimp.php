<?php

namespace App\Console\Commands;

use App\Services\Mailchimp\SendCustomersToMailchimpService;
use Illuminate\Console\Command;

class SendUsersToMailchimp extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sync:users';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync Users to Mailchimp';

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
    public function handle(SendCustomersToMailchimpService $sendCustomersToMailchimpService)
    {
        $sendCustomersToMailchimpService->createListOnMailchimp(SendCustomersToMailchimpService::TEMPLATE_SIGN_UP_USERS);

        return 0;
    }
}
