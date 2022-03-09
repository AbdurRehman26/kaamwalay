<?php

namespace App\Console\Commands\Orders;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderItemStatus;
use App\Models\OrderItemStatusHistory;
use App\Models\OrderStatus;
use App\Models\OrderStatusHistory;
use Carbon\Carbon;
use Exception;
use Illuminate\Console\Command;

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

    public function handle(): int
    {

        try{

            $date = Carbon::parse($this->argument('date'))->toDateString();

            $orderIds = Order::where('order_status_id', '=', OrderStatus::PAYMENT_PENDING)
                ->whereDate('created_at', '<', $date)
                ->pluck('id');

            $orderItemIds = OrderItem::whereIn('order_id', $orderIds)
                ->pluck('id');


            OrderStatusHistory::whereIn('order_id', $orderIds)
                ->update([
                    'order_status_id', OrderStatus::CANCELLED
                ]);

            OrderItemStatusHistory::whereOrderItemId($orderItemIds)
                ->update([
                    'order_item_status_id', -1
                ]);


        }catch (Exception $e){

            $this->info('Error while deleting orders');
            $this->info($e->getMessage());

        }

        return 0;
    }
}
