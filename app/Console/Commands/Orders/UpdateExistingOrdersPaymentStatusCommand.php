<?php

namespace App\Console\Commands\Orders;

use App\Enums\Order\OrderPaymentStatusEnum;
use App\Models\Order;
use App\Models\OrderStatus;
use Illuminate\Console\Command;

class UpdateExistingOrdersPaymentStatusCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'orders:update-payment-status';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This command needs to be run one time only and it will update all the existing orders with
    correct payment status';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        Order::query()
            ->whereNotIn('order_status_id', [OrderStatus::PAYMENT_PENDING, OrderStatus::CANCELLED])
            ->get()
            ->tap(function ($collection) {
                $this->info('Found ' . $collection->count() . ' Orders');
            })
            ->each
            ->update([
                'payment_status' => OrderPaymentStatusEnum::PAID,
            ]);

        $this->info('Updated!');
    }
}
