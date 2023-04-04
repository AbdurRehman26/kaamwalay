<?php

namespace App\Console\Commands;

use App\Enums\Wallet\WalletTransactionReason;
use App\Models\User;
use App\Services\Wallet\WalletService;
use Illuminate\Console\Command;
use Maatwebsite\Excel\Facades\Excel;

class DeductCreditFromCustomerWallet extends Command
{
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
    public function handle(WalletService $walletService): int
    {
        $fileName = $this->ask('Filename (e.g storage/app/public/file.csv)');
        $data = Excel::toArray(new \StdClass(), $fileName);
        $customers = array_shift($data);

        $this->info('Deducting customer balance...');

        foreach ($customers as $customer) {
            $user = User::whereCustomerNumber($customer[0])->first();

            if (! empty($user)) {
                if ($user->wallet->balance != 40) {
                    $this->info(sprintf('Customer %s Wallet Balance : %s', $user->customer_number, $user->wallet->balance));

                    continue;
                }

                $this->info('------------------------');

                $this->info(sprintf('Customer Number : %s', $user->customer_number));
                $this->info(sprintf('Before Deduction -> Balance: %s', $user->wallet->balance));

                $walletService->processTransaction(
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
