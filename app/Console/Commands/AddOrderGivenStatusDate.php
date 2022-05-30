<?php

namespace App\Console\Commands;

use App\Models\Order;
use App\Models\OrderStatus;
use App\Models\OrderStatusHistory;
use Illuminate\Console\Command;

class AddOrderGivenStatusDate extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'orders:add-orders-status-date {orderStatusId : 2}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Add Orders Given Status Date';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle(): int
    {
        $orderStatusId = (int)$this->argument('orderStatusId');

        $status = match ($orderStatusId) {
            OrderStatus::CONFIRMED => 'reviewed_at',
            OrderStatus::GRADED => 'graded_at',
            OrderStatus::SHIPPED => 'shipped_at',
            default => null,
        };

        if ($status != null) {
            $this->info('Generating shipping date for orders.');

            Order::where('order_status_id', $orderStatusId)
                ->where($status, null)
                ->get()
                ->each(function (Order $order) {
                    $orderStatusId = (int)$this->argument('orderStatusId');

                    $statusDate = OrderStatusHistory::where('order_id', $order->id)
                        ->where('order_status_id', $orderStatusId)
                        ->first()?->created_at;

                    match ($orderStatusId) {
                        OrderStatus::CONFIRMED => $order->reviewed_at = $statusDate,
                        OrderStatus::GRADED => $order->graded_at = $statusDate,
                        OrderStatus::SHIPPED => $order->shipped_at = $statusDate,
                        default => null,
                    };

                    $order->save();
                    $this->info("Shipping date for order # {$order->order_number} Completed.");
                });

            $this->info('Shipping date for orders Generated.');
        } else {
            $this->info('Invalid order status provided.');
        }
        return 0;
    }
}
