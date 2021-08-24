<?php

namespace App\Console\Commands;

use App\Models\OrderPayment;
use App\Services\Payment\PaymentService;
use Illuminate\Console\Command;

class UpdateProviderFee extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'provider-fee:update';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update All Provider Fees';

    public function handle(): int
    {
        $paymentService = new PaymentService();
        OrderPayment::whereNull('provider_fee')->get()->map(function ($orderPayment) use ($paymentService) {
            $paymentService->calculateAndSaveFee($orderPayment->order);
        });

        return 0;
    }
}
