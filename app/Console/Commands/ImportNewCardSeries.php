<?php

namespace App\Console\Commands;

use App\Imports\CardSeriesImport;
use Illuminate\Console\Command;
use Maatwebsite\Excel\Facades\Excel;

class ImportNewCardSeries extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'card-series:import';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        Excel::import(new CardSeriesImport, storage_path('app/public/japanese_pokemon_new_series.csv'));

        return Command::SUCCESS;
    }
}
