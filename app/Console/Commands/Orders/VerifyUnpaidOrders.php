<?php

namespace App\Console\Commands\Orders;

use App\Exceptions\API\Customer\Order\PaymentBlockchainNetworkNotSupported;
use App\Models\Order;
use App\Models\OrderStatus;
use App\Models\User;
use App\Services\Payment\PaymentService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class VerifyUnpaidOrders extends Command
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
    public function handle(PaymentService $paymentService)
    {
        $email = $this->option('email');
        $user = User::whereEmail($email)->first();
        auth()->login($user);

        $unpaidOrders = Order::where('order_status_id', OrderStatus::PAYMENT_PENDING)->whereHas('paymentMethod', function ($query) {
            return $query->where('code', 'collector_coin');
        })->get();

        $unpaidOrders->each(function (Order $order) use ($paymentService) {
            $this->info("Processing Order: $order->id");
    
            try {
                $paymentService->verify($order, json_decode($order->firstOrderPayment->response, true)['txn_hash']);
            } catch (PaymentBlockchainNetworkNotSupported $nsn) {
                Log::error('Order ID: ' . $order->id . ' has a not supported payment network and can not be processed.');
            }
        });

        return 0;
    }
}
