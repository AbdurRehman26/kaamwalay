<?php

namespace App\Console\Commands\Orders;

use App\Models\User;
use App\Services\Payment\PaymentHandshakeService;
use Illuminate\Console\Command;

class ProcessPaymentHandshake extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'order-payments:process-payment-handshake {--email=}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Process payment handshake for pending order payments to get updated payment status';


    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle(PaymentHandshakeService $paymentHandshakeService)
    {
        $email = $this->option('email');
        $user = User::whereEmail($email)->first();
        auth()->login($user);

        $paymentHandshakeService->processHandshake();

        return 0;
    }
}
