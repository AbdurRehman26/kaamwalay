<?php

namespace Database\Seeders;

use App\Models\OrderItem;
use Illuminate\Database\Seeder;

class UpdateMultipleOrderItemsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $items = OrderItem::where('quantity', '>', 1)->get();
        $this->command->info('Found ' . count($items). ' items.');

        foreach ($items as $item) {
            $this->command->info('Processing Order Item ' . $item->id);
            for ($i = 0; $i < $item->quantity - 1; $i++) {
                $newItem = $item->replicate();
                $newItem->quantity = 1;
                $newItem->declared_value_total = $item->declared_value_per_unit;
                $newItem->save();

                $this->command->info('Created Order Item ' . $newItem->id);
            }

            $item->quantity = 1;
            $item->declared_value_total = $item->declared_value_per_unit;
            $item->save();
            $this->command->info('Updated Order Item ' . $item->id);
        }

        $this->command->info('Process completed.');
    }
}
