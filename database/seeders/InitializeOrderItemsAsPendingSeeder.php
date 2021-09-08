<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Services\Admin\Order\OrderItemService;
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
        $orderItemService = new OrderItemService();

        $items = OrderItem::all();
        foreach($items as $item){
            $orderItemService->changeStatus($item->order,$item,["status" => "pending"]);
        }
    }
}
