<?php

namespace App\Console\Commands\ReferralProgram;

use App\Models\User;
use App\Services\ReferralProgram\ReferrerService;
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
     */
    public function handle(): int
    {
        $users = User::whereDoesntHave('referrer')->get();
        $referrerService = new ReferrerService();

        foreach ($users as $user) {
            $this->info('Processing user '.$user->id);
            $referrerService->create($user);
        }

        return Command::SUCCESS;
    }
}
