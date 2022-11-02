<?php

namespace App\Console\Commands\Hubspot;

use App\Enums\Order\OrderPaymentStatusEnum;
use App\Models\HubspotDeal;
use App\Models\Order;
use App\Models\User;
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
        $deals = HubspotDeal::get();
        foreach ($deals as $deal) {
            $user = User::where('email', $deal->user_email)->first();
            $order = Order::where('user_id', $user->id)->where('payment_status', OrderPaymentStatusEnum::PAID)->first();
            if ($order) {
                $hubspotService->updateDealStageForPaidOrder($order);
            }
        }

        return Command::SUCCESS;
    }
}
