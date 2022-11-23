<?php

namespace App\Console\Commands\SalesReps;

use App\Models\Salesman;
use App\Models\User;
use Illuminate\Console\Command;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\SalesManImport;

class ImportCustomers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'salesman:link-customers-to-salesman';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This command will link given customers emails sheet with the give salesman email';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $fileName = $this->ask('Filename (storage/app/)');
        $salesManEmail = $this->ask('SalesMan Email');

        $emails = Excel::import(new SalesManImport, $fileName, 's3', \Maatwebsite\Excel\Excel::XLSX);

        $user = User::where('email', $salesManEmail)->first();
        $salesMan= Salesman::where('user_id', $user->id)->first();
        
        User::whereIn('email', $emails)->update(
            [
                'salesman_id' => $salesMan->id,
            ],
        );
        return Command::SUCCESS;
    }
}
