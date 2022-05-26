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
        $this->info('Generating shipping date for orders.');

        Order::where('order_status_id', OrderStatus::SHIPPED)
            ->where('shipped_at', null)
            ->get()
            ->each(function (Order $order) {
                $this->info("Shipping date for orders # {$order->order_number} Completed.");

                $order->shipped_at = OrderStatusHistory::where('order_id', $order->id)
                    ->where('order_status_id', OrderStatus::SHIPPED)
                    ->first()->shipped_at;

                $order->save();
            });

        $this->info('Shipping date for orders Completed.');

        return 0;
    }
}
