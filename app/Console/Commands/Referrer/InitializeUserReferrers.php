<?php

namespace App\Console\Commands\Referrer;

use App\Models\User;
use App\Services\Referrer\ReferrerService;
use Illuminate\Console\Command;

class InitializeUserReferrers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'referrer:initialize';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'It generates Referrer objects for all User objects in the system.';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $users = User::all();
        $referrerService = new ReferrerService();

        foreach ($users as $user) {
            $this->info('Processing user '. $user->id);
            $referrerService->createUserReferrer($user);
        }

        return Command::SUCCESS;
    }
}
