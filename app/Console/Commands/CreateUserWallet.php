<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Models\Wallet;
use Illuminate\Console\Command;
use Symfony\Component\Console\Command\Command as CommandAlias;

class CreateUserWallet extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'users:create-wallet';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This command will create the wallets for users';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle(): int
    {
        User::whereDoesntHave('wallet')->get()
            ->each(function (User $user) {
                Wallet::createWallet($user);
            });
        $this->info('wallets created');

        return CommandAlias::SUCCESS;
    }
}
