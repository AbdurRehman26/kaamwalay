<?php

namespace App\Console\Commands\Orders;

use App\Models\Order;
use App\Models\OrderStatus;
use App\Models\User;
use App\Services\Order\V2\OrderService;
use Carbon\Carbon;
use Exception;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Event;

class MarkOldOrdersAsCancelled extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'orders:mark-cancelled-before-date {date}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Mark all the orders as cancelled before given date. i.e Format (d-m-Y, d/m/Y)';

    public function handle(OrderService $orderService): int
    {
        Event::fake();
        try {
            $date = Carbon::parse($this->argument('date'))->toDateString();

            $orders = Order::where('order_status_id', '=', OrderStatus::PAYMENT_PENDING)
                ->whereDate('created_at', '<', $date)
                ->get();

            foreach ($orders as $order) {
                $this->info("Canceling order#: $order->order_number");
                $orderService->cancelOrder($order, User::admin()->first());
                $this->info("Canceled order#: $order->order_number");
            }
        } catch (Exception $e) {
            $this->info('Error while deleting orders');
            $this->info($e->getMessage());
        }

        return 0;
    }
}
