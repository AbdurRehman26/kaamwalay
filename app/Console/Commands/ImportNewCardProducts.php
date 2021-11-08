<?php

namespace App\Console\Commands;

use App\Imports\CardProductsImport;
use Illuminate\Console\Command;
use Maatwebsite\Excel\Facades\Excel;

class ImportNewCardProducts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'card-products:import';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        Excel::import(new CardProductsImport, storage_path('app/public/japanese_pokemon_final.csv'));

        return Command::SUCCESS;
    }
}
