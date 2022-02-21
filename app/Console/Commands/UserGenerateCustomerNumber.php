<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Services\SerialNumberService\SerialNumberService;
use Illuminate\Console\Command;

class UserGenerateCustomerNumber extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'users:generate-customer-number';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate customer number for all users that don\'t have one.';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $result = User::query()->whereNull('customer_number')->update([
            'customer_number' => SerialNumberService::customer()->toSql(),
        ]);

        $this->info("Changed $result records.");

        return 0;
    }
}
