<?php

namespace App\Console\Commands\Orders;

use App\Exceptions\API\Admin\OrderStatusHistoryWasAlreadyAssigned;
use App\Services\Admin\OrderService;
use App\Services\Admin\OrderStatusHistoryService;
use Illuminate\Console\Command;
use PHPUnit\Exception;
use Throwable;

class OrderGenerateStatusHistoryCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'orders:generate-status-history';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate order status history based on current history';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(
        public  OrderService $orderService,
        public  OrderStatusHistoryService $orderStatusHistoryService,
    )
    {
        parent::__construct();
    }

    /**
     * @return int
     * @throws OrderStatusHistoryWasAlreadyAssigned
     * @throws Throwable
     */
    public function handle()
    {
        $orders = $this->orderService->getOrders();

        $email = $this->ask('Your account email');
        $password = $this->secret("Password of '$email'");

        auth()->attempt(compact('email', 'password'));

        foreach ($orders as $order) {
            if ($order->order_status_id) {
                $this->info("- Found Order [$order->id] with status '$order->order_status_id'");
                for ($orderStatusId = $order->order_status_id; $orderStatusId >= 1; $orderStatusId--) {
                    try {
                        $this->orderStatusHistoryService->addStatusToOrder($orderStatusId, $order);
                        $status = "OK";
                    } catch (\Exception $e) {
                        $message = $e->getMessage();
                        $status = "FAIL [$message]";
                    }

                    $this->info("    - Add status '$orderStatusId' to the history.    $status");
                }
            }

            $this->newLine();
        }

        return 0;
    }
}
