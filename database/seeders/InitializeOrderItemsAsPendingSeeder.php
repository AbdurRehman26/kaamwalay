<?php

namespace Database\Seeders;

use App\Models\OrderItem;
use App\Models\User;
use App\Services\Admin\Order\OrderItemService;
use Illuminate\Database\Seeder;

class InitializeOrderItemsAsPendingSeeder extends Seeder
{
    public function __construct(protected OrderItemService $orderItemService)
    {
    }

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        $items = OrderItem::all();
        foreach ($items as $item) {
            $this->orderItemService->changeStatus($item->order, $item, ["status" => "pending"], User::find(1));
        }
    }
}
