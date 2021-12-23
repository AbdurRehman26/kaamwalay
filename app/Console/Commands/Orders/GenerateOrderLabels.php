<?php

namespace App\Console\Commands\Orders;

use App\Models\Order;
use App\Models\OrderStatus;
use App\Jobs\Admin\Order\CreateOrderLabel;
use Illuminate\Console\Command;

class GenerateOrderLabels extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'orderLabels:generate {orderNumber? : RG000000001}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate missing order labels for already graded orders';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    public function handle(): int
    {
        if (!$this->argument('orderNumber'))
        {
            $orders = Order::where('order_status_id', '=', OrderStatus::GRADED)->get();
            foreach($orders as $order)
            {
                if(!$order->orderLabel)
                {
                    $this->info('Generating order label for order # ' . $order->order_number);
                    CreateOrderLabel::dispatch($order);
                    $this->info('Order label for order # ' . $order->order_number . ' is generated');
                }
            }
        }
        else {
            $order = Order::where('order_number', $this->argument('orderNumber'))->first();

            if ($order->order_status_id != OrderStatus::GRADED)
            {
                $this->info('Order is not graded yet');
            }
            else if (!$order->orderLabel) {
                $this->info('Generating order label for order # ' . $order->order_number);
                CreateOrderLabel::dispatch($order);
                $this->info('Order label for order # ' . $order->order_number . ' is generated');
                
            }
            else {
                $this->info('Order Label already exist');
            }
        }
        
        return 0;
    }
}
