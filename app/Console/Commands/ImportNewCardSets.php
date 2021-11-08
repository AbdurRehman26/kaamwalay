<?php

namespace App\Console\Commands;

use App\Imports\CardSetsImport;
use Illuminate\Console\Command;
use Maatwebsite\Excel\Facades\Excel;

class ImportNewCardSets extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'card-sets:import';

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
        Excel::import(new CardSetsImport, storage_path('app/public/japanese_pokemon_new_sets.csv'));

        return Command::SUCCESS;
    }
}
