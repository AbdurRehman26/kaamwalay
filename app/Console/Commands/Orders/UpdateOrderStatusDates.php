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
        $reviewedAtStatusId = 0;
        $gradedAtStatusId = 0;

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

        if ($orderStatusId === OrderStatus::GRADED) {
            $reviewedAtStatusId = 3;
        }

        if ($orderStatusId === OrderStatus::SHIPPED) {
            $reviewedAtStatusId = 3;
            $gradedAtStatusId = 4;
        }

        $this->info("Updating status dates for orders...");
        Order::where('order_status_id', $orderStatusId)
            ->get()
            ->each(function (Order $order) use ($orderStatusId, $column, $reviewedAtStatusId, $gradedAtStatusId) {
                $statusDate = OrderStatusHistory::where('order_id', $order->id)
                    ->where('order_status_id', $orderStatusId)
                    ->first()?->created_at;

                if ($reviewedAtStatusId != 0) {
                    $reviewedAtStatusDate = OrderStatusHistory::where('order_id', $order->id)
                        ->where('order_status_id', $reviewedAtStatusId)
                        ->first()?->created_at;
                    
                    $order->reviewed_at = $reviewedAtStatusDate;
                    $this->info("reviewed_at for $order->order_number updated.");
                }

                if ($gradedAtStatusId != 0) {
                    $gradedAtStatusDate = OrderStatusHistory::where('order_id', $order->id)
                        ->where('order_status_id', $gradedAtStatusId)
                        ->first()?->created_at;
                        
                    $order->graded_at = $gradedAtStatusDate;
                    $this->info("graded_at for $order->order_number updated.");
                }

                if ($statusDate) {
                    $order->$column = $statusDate;
                    $order->save();
                    $this->info("$column for $order->order_number updated.");
                }
            });

        $this->info("Status Dates for orders have been updated.");

        return 0;
    }
}
