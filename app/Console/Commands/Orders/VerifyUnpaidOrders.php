<?php

namespace App\Console\Commands\Orders;

use App\Exceptions\API\Customer\Order\NotSupportedPaymentNetwork;
use App\Models\Order;
use App\Models\OrderStatus;
use App\Models\User;
use App\Services\Payment\PaymentService;
use Illuminate\Console\Command;

class VerifyUnpaidOrders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'orders:verify-unpaid-ags {--email=}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Verify transaction status for unpaid AGS orders';

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
            return $query->where('code', 'ags');
        })->get();

        foreach($unpaidOrders as $unpaidOrder) 
        {
            $this->info("Processing Order: $unpaidOrder->id");

            try{
                $paymentService->verifyAgs($unpaidOrder);
            } catch(NotSupportedPaymentNetwork $nsn){}
        }
    }
}
