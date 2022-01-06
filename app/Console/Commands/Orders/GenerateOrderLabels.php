<?php

namespace App\Console\Commands\Orders;

use App\Exceptions\Services\AGS\AgsServiceIsDisabled;
use App\Models\Order;
use App\Models\OrderStatus;
use App\Services\Admin\Order\OrderLabelService;
use Illuminate\Console\Command;

class GenerateOrderLabels extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'orders:generate-label {orderNumber? : RG000000001}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate order labels for already graded orders';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    public function handle(OrderLabelService $orderLabelService): int
    {
        $ordersQuery = Order::where('order_status_id', '>=', OrderStatus::GRADED);
        $orderNumber = $this->argument('orderNumber');

        if ($orderNumber) {
            $ordersQuery->where('order_number', $orderNumber);
        } else {
            $ordersQuery->doesntHave('orderLabel');
        }

        $orders = $ordersQuery->get();
        $this->info("Total {$orders->count()} orders found");

        $orders->each(/*** @throws AgsServiceIsDisabled */ function (Order $order) use ($orderLabelService) {
            $this->info("Generating label for order # {$order->order_number} ...");
            $orderLabelService->generateLabel($order);
            $this->info('Label has been generated.');
        });

        return 0;
    }
}
