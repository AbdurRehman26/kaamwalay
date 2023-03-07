<?php

namespace App\Console\Commands\Orders;

use App\Models\Order;
use App\Models\OrderStatus;
use App\Models\OrderStatusHistory;
use Illuminate\Console\Command;

class AddAssembledStatusToOrderStatusHistory extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'orders:add-assembled-in-status-history';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This command will add the newly added Assembled status to all the previous shipped orders.';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle(): int
    {
        if (
            $this->confirm('This action will add Assembled status to all the previous orders\' status history. Do you want to continue?')
        ) {
            Order::where('order_status_id', OrderStatus::SHIPPED)
                ->get()
                ->tap(function ($collection) {
                    $this->info('Found ' . $collection->count() . ' Orders with shipped status');
                })
                ->each(function (Order $order) {
                    /** @var OrderStatusHistory $shippedOrderHistory */
                    $shippedOrderHistory = $order->orderStatusHistory()->latest()->first();
                    $order->orderStatusHistory()->create([
                        'order_status_id' => OrderStatus::ASSEMBLED,
                        'user_id' => $shippedOrderHistory->user_id,
                        'created_at' => $shippedOrderHistory->created_at,
                        'updated_at' => $shippedOrderHistory->updated_at,
                    ]);

                    $this->info("Order: {$order->id} has been updated.");
                });

            $this->info('All shipped orders now have assembled status!');
        }

        return 0;
    }
}
