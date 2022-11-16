<?php

namespace App\Console\Commands\Hubspot;

use App\Enums\Order\OrderPaymentStatusEnum;
use App\Models\HubspotDeal;
use App\Models\Order;
use App\Models\User;
use App\Services\HubspotService;
use Illuminate\Console\Command;
use SevenShores\Hubspot\Resources\Deals;

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
        // @phpstan-ignore-next-line
        $deals = (new Deals($hubspotService->getClient()))->all(['properties' => 'dealstage'])->getData()->deals;

        foreach ($deals as $deal) {
            if ($deal->properties->dealstage->value === config('services.hubspot.pipline_stage_id_new_customer')) {
                $hubspotDeal = HubspotDeal::where('deal_id', $deal->dealId)->first();
                if ($hubspotDeal) {
                    $user = User::where('email', $hubspotDeal->user_email)->first();
                    $order = Order::where('user_id', $user->id)->where('payment_status', OrderPaymentStatusEnum::PAID)->first();
                    if ($order) {
                        $this->info("Moving $user->first_name deal from " . config('services.hubspot.pipline_stage_id_new_customer') . " to " . config('services.hubspot.pipline_stage_id_closed'));
                        $hubspotService->updateDealStageForPaidOrder($order);
                    }
                }
            }
        }

        return Command::SUCCESS;
    }
}
