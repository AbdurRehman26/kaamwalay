<?php

namespace App\Console\Commands;

use App\Models\OrderPayment;
use App\Models\OrderStatus;
use App\Services\Payment\PaymentService;
use Illuminate\Console\Command;

class UpdatePaymentProviderFee extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'payment-provider-fee:calculate-for-missing-orders';

    /**
     * The console command description.
     * @var string
     */
    protected $description = 'Update Payment Provider Fee for missing orders';

    public function handle(PaymentService $paymentService): int
    {
        $this->info("Updating payment provider fee for all missing orders");

        OrderPayment::join('orders', function ($join) {
            $join->on('orders.id', '=', 'order_payments.order_id');
        })->where('orders.order_status_id', OrderStatus::STATUSES['placed'])
            ->whereNull('order_payments.provider_fee')
            ->select('order_payments.*')
            ->get()->each(function (OrderPayment $orderPayment) use ($paymentService) {
                $paymentService->calculateAndSaveFee($orderPayment->order);
            });

        $this->info("Updated.");

        return 0;
    }
}