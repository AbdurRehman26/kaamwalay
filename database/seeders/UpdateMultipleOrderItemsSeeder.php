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
        $items = OrderItem::where('quantity', '>', 1)->where('order_id', '>', 10)->get();

        foreach ($items as $item) {
            for ($i = 0; $i < $item->quantity - 1; $i++) {
                $newItem = $item->replicate();
                $newItem->quantity = 1;
                $newItem->declared_value_total = $item->declared_value_per_unit;
                $newItem->save();
            }

            $item->quantity = 1;
            $item->declared_value_total = $item->declared_value_per_unit;
            $item->save();
        }
    }
}
