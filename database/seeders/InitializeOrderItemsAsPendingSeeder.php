<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Services\Order\OrderItemsService;
use App\Models\OrderItem;

class InitializeOrderItemsAsPendingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $orderItemsService = new OrderItemsService();

        $items = OrderItem::all();
        foreach($items as $item){
            $orderItemsService->changeStatus($item->order,$item,["status" => "pending"]);
        }
    }
}
