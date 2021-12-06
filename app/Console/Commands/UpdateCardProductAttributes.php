<?php

namespace App\Console\Commands;

use App\Imports\CardProductAttributesUpdate;
use Illuminate\Console\Command;
use Maatwebsite\Excel\Facades\Excel;

class UpdateCardProductAttributes extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'card-product:update-attributes';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update card product attributes';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        Excel::import(new CardProductAttributesUpdate, storage_path('app/public/japanese_cards_update.csv'));

        return Command::SUCCESS;
    }
}
