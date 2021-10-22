<?php

namespace App\Console\Commands;

use App\Imports\CardsImport;
use Illuminate\Console\Command;
use Maatwebsite\Excel\Facades\Excel;

class ImportCardsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cards:import';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import new cards to the database.';

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
        Excel::import(new CardsImport, storage_path('app/public/new-variants-cards.csv'));

        return 0;
    }
}
