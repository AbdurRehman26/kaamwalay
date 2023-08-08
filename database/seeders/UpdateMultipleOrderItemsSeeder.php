<?php

namespace Database\Seeders;

use App\Models\OrderItem;
use Illuminate\Database\Seeder;

class UpdateMultipleOrderItemsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $currentDateTime = new \Datetime();
        $items = OrderItem::where('quantity', '>', 1)->get();

        foreach ($items as $item) {
            $quantity = $item->quantity;
            for ($i = 0; $i < $quantity - 1; $i++) {
                $newItem = $item->replicate();
                $newItem->quantity = 1;
                $newItem->created_at = $currentDateTime;
                $newItem->save();
            }

            $item->quantity = 1;
            $item->save();
        }

    }
}
