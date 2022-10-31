<?php

namespace App\Console\Commands\Hubspot;

use App\Enums\Order\OrderPaymentStatusEnum;
use App\Models\Order;
use App\Services\HubspotService;
use Illuminate\Console\Command;

class CloseOldDeals extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'hubspot:close-paid-order-deals';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This command will close deals in which customer has atleast one paid order';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle(HubspotService $hubspotService)
    {
        $orders = Order::where('payment_status', OrderPaymentStatusEnum::PAID)->get();
        foreach ($orders as $order) {
            $hubspotService->updateDealStageForPaidOrder($order);
        }

        return Command::SUCCESS;
    }
}
