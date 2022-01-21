<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\Mailchimp\SendCustomersToMailchimpServices;

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
    public function handle(SendCustomersToMailchimpServices $sendCustomersToMailchimpServices)
    {
        $sendCustomersToMailchimpServices->createListOnMailchimp(SendCustomersToMailchimpServices::TEMPLATE_SIGN_UP_USERS);
        return 0;
    }
}
