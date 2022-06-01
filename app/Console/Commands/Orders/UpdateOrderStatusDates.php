<?php

namespace App\Console\Commands\Orders;

use App\Models\Order;
use App\Models\OrderStatus;
use App\Models\OrderStatusHistory;
use Illuminate\Console\Command;

class UpdateOrderStatusDates extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'orders:update-status-dates {orderStatusId : 2}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'It updates status dates on orders, e.g. arrived_at, reviewed_at, graded_at, shipped_at';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle(): int
    {
        $orderStatusId = (int)$this->argument('orderStatusId');

        $column = match ($orderStatusId) {
            OrderStatus::CONFIRMED => 'reviewed_at',
            OrderStatus::GRADED => 'graded_at',
            OrderStatus::SHIPPED => 'shipped_at',
            default => null,
        };

        if ($column === null) {
            $this->info('Invalid order status provided.');

            return 1;
        }

        $this->info("Updating $column for orders...");

        Order::where('order_status_id', $orderStatusId)
            ->whereNull($column)
            ->get()
            ->each(function (Order $order) use ($orderStatusId, $column) {
                $statusDate = OrderStatusHistory::where('order_id', $order->id)
                    ->where('order_status_id', $orderStatusId)
                    ->first()?->created_at;

                if ($statusDate) {
                    $order->$column = $statusDate;
                    $order->save();
                    $this->info("$column for $order->order_number updated.");
                }
            });

        $this->info("$column for orders have been updated.");

        return 0;
    }
}
