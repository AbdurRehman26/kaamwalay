<?php

namespace App\Console\Commands\Orders;

use App\Exceptions\API\Admin\OrderStatusHistoryWasAlreadyAssigned;
use App\Models\Order;
use App\Models\OrderStatusHistory;
use Illuminate\Console\Command;
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
    public function __construct()
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
        $orders = Order::all();

        $email = $this->ask('Your account email');
        $password = $this->secret("Password of '$email'");

        if (! auth()->attempt(compact('email', 'password'))) {
            $this->error("Invalid credentials!");

            return  1;
        }

        $user = auth()->user();
        if (! $user || ! $user->isAdmin()) {
            $this->error("Unauthorized access!");

            return  1;
        }

        foreach ($orders as $order) {
            if ($order->order_status_id) {
                $this->info("- Found Order [$order->id] with status '$order->order_status_id'");
                for ($orderStatusId = 1; $orderStatusId <= $order->order_status_id; $orderStatusId++) {
                    try {
                        OrderStatusHistory::create([
                           'order_id' => $order->id,
                           'order_status_id' => $orderStatusId,
                           'user_id' => $user?->id,
                        ]);
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
