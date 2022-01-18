<?php

namespace App\Console\Commands\Orders;

use App\Exceptions\API\Customer\Order\PaymentBlockchainNetworkNotSupported;
use App\Models\Order;
use App\Models\OrderStatus;
use App\Models\User;
use App\Services\Payment\PaymentService;
use Carbon\Carbon;
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

        $unpaidOrders = Order::where('order_status_id', OrderStatus::PAYMENT_PENDING)
            ->where('created_at', '>', Carbon::now()->subHours(2)->toDateTimeString())
            ->whereHas('paymentMethod', function ($query) {
                return $query->where('code', 'collector_coin');
            })->whereHas('orderPayments', function ($query) {
                return $query->whereNotNull('payment_provider_reference_id');
            })->get();

        $unpaidOrders->each(function (Order $order) use ($paymentService) {
            $this->info("Processing Order: $order->id");
    
            try {
                $orderPayment = $order->firstCollectorCoinOrderPayment;
                if ($orderPayment) {
                    $paymentService->processHandshake($order, json_decode($orderPayment->response, true)['txn_hash']);
                }
            } catch (PaymentBlockchainNetworkNotSupported $nsn) {
                Log::error('Order ID: ' . $order->id . ' has a not supported payment network and can not be processed.');
            }
        });

        return 0;
    }
}
