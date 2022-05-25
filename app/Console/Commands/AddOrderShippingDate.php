<?php

namespace App\Console\Commands;

use App\Models\Order;
use App\Models\OrderStatus;
use App\Models\OrderStatusHistory;
use Illuminate\Console\Command;

class AddOrderShippingDate extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'orders:add-shipping-date';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Add Shipping Date Of Orders';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle(): int
    {
        $orders = Order::where('order_status_id', OrderStatus::SHIPPED)
            ->where('shipped_at', null)
            ->get();

        $this->info("Generating shipping date for orders.");

        foreach ($orders as $order) {
            $shippingDate = OrderStatusHistory::where('order_id', $order->id)
                ->where('order_status_id', OrderStatus::SHIPPED)
                ->first();

            $order->shipped_at = $shippingDate->created_at;
            $order->save();
        }

        $this->info("Shipping date for orders Generated. ");

        return 0;
    }
}
