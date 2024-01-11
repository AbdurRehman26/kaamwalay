<?php

namespace App\Console\Commands;

use App\Imports\AutographProductsImport;
use Illuminate\Console\Command;

class ImportAutographProductsCommand extends Command
{
    protected $signature = 'autograph-products:import';

    protected $description = 'Import autograph products and images from files.';

    public function handle(): void
    {
//        $fileName = $this->ask('Filename (storage/app/)');
        $fileName = 'autograph_products.csv';
        (new AutographProductsImport())->import($fileName, 'local', \Maatwebsite\Excel\Excel::CSV);
    }
}
