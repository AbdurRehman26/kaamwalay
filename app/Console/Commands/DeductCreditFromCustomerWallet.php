<?php

namespace App\Console\Commands;

use App\Enums\Wallet\WalletTransactionReason;
use App\Models\User;
use App\Services\Wallet\WalletService;
use Illuminate\Console\Command;
use Maatwebsite\Excel\Facades\Excel;

class DeductCreditFromCustomerWallet extends Command
{
    public function __construct(private WalletService $walletService)
    {
        parent::__construct();
    }

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'wallet:deduct-customer-credit';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Deduct 40$ from customer wallet.';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $fileName = 'storage/app/public/CreditRemovalSheet.csv';//$this->ask('Filename (e.g storage/app/public/file.csv)');
        $customers = Excel::toArray([], $fileName);

        $this->info('Deducting customer balance...');

        foreach (array_shift($customers) as $customer) {
            $user = User::whereCustomerNumber('C00014582')->first();

            if (! empty($user)) {
                if ($user->wallet->balance != 40) {
                    $this->info(sprintf('Customer %s Wallet Balance : %s', $user->customer_number, $user->wallet->balance));

                    continue;
                }

                $this->info('------------------------');

                $this->info(sprintf('Customer Number : %s', $user->customer_number));
                $this->info(sprintf('Before Deduction -> Balance: %s', $user->wallet->balance));

                $this->walletService->processTransaction(
                    $user->wallet->id,
                    -40,
                    WalletTransactionReason::WALLET_DEBIT,
                    $user->id,
                    null
                );

                $this->info(sprintf('After Deduction -> Balance: %s', $user->wallet->refresh()->balance));
            } else {
                $this->info(sprintf(
                    'Customer with customer number : %s does not exist',
                    $customer[0]
                ));
            }
        }

        $this->info('Done...');

        return Command::SUCCESS;
    }
}
