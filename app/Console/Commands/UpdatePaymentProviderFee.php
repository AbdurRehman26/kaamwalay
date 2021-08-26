<?php

namespace App\Console\Commands;

use App\Models\OrderPayment;
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
        OrderPayment::whereNull('provider_fee')->get()->each(function (OrderPayment $orderPayment) use ($paymentService) {
            $paymentService->calculateAndSaveFee($orderPayment->order);
        });

        return 0;
    }
}
