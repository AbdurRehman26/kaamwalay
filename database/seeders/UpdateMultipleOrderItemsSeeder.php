<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\OrderItem;

class UpdateMultipleOrderItemsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $currentDateTime = new \Datetime();
        $items = OrderItem::where('quantity','>',1)->get();

        foreach($items as $item){
            $quantity = $item->quantity;
            for($i = 0; $i < $quantity - 1; $i++){
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
