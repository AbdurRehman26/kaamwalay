<?php

namespace App\Console\Commands\Salesman;

use App\Imports\CustomersImport;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Arr;
use Maatwebsite\Excel\Facades\Excel;

class LinkCustomersToSalesman extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'salesman:assign-to-customers';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'It assigns salesman to customers, provided in the sheet.';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $fileName = $this->ask('Filename (ExcelFile.xlsx)');
        $salesmanEmail = $this->ask('SalesMan Email');
        if ($fileName && $salesmanEmail) {
            $emails = Arr::flatten(Excel::toArray(new CustomersImport, $fileName, 's3', \Maatwebsite\Excel\Excel::XLSX)[0]);
            $user = User::where('email', $salesmanEmail)->first();
            if($user)
            {
                User::whereIn('email', $emails)->update(
                    [
                        'salesman_id' => $user->id,
                    ],
                );
                $this->info('Linked Customers With Salesman Successfully');
            }
            else {
                $this->info('Invalid Email');
            }
        }

        return Command::SUCCESS;
    }
}
