<?php

namespace App\Console\Commands\Orders;

use App\Enums\Order\OrderPaymentStatusEnum;
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

            $adminUser = User::admin()->first();
            Order::where('order_status_id', '=', OrderStatus::PAYMENT_PENDING)
                ->whereDate('created_at', '<=', $date)
                ->get()
                ->tap(function ($collection) {
                    $this->info('Found ' . $collection->count() . ' Orders');
                })
                ->each(fn (Order $order) => $orderService->cancelOrder($order, $adminUser));

            $this->info('Marked Cancelled!');
        } catch (Exception $e) {
            $this->info('Error while deleting orders');
            $this->info($e->getMessage());
        }

        return self::SUCCESS;
    }
}
