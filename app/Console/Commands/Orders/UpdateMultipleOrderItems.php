<?php

namespace App\Console\Commands\Orders;

use App\Models\OrderItem;
use Illuminate\Console\Command;

class UpdateMultipleOrderItems extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'orders:separate-items';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Separate order items with quantity greater than 1 into multiple rows';

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
    public function handle(): int
    {
        $items = OrderItem::where('quantity', '>', 1)->get();
        $this->info('Found ' . count($items). ' items.');

        foreach ($items as $item) {
            $this->info('Processing Order Item ' . $item->id);
            for ($i = 0; $i < $item->quantity - 1; $i++) {
                $newItem = $item->replicate();
                $newItem->quantity = 1;
                $newItem->declared_value_total = $item->declared_value_per_unit;
                $newItem->save();

                $this->info('Created Order Item ' . $newItem->id);
            }

            $item->quantity = 1;
            $item->declared_value_total = $item->declared_value_per_unit;
            $item->save();
            $this->info('Updated Order Item ' . $item->id);
        }

        $this->info('Process completed.');

        return 0;
    }
}
