<?php

namespace App\Console\Commands\Hubspot;

use App\Enums\Order\OrderPaymentStatusEnum;
use App\Models\HubspotDeal;
use App\Models\Order;
use App\Models\User;
use App\Services\HubspotService;
use Illuminate\Console\Command;
use SevenShores\Hubspot\Resources\Deals;

use function PHPUnit\Framework\isEmpty;

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
        $offset = 0;
        $hasMore = true;

        if (empty(config('services.hubspot.deal_stage')))
        {
            return $this->info("Deal stage is not set");
        }
        
        while ($hasMore == true) {
            $allDeals = (new Deals($hubspotService->getClient()))->all(['properties' => 'dealstage', 'limit' => 250, 'offset' => $offset]);
            // @phpstan-ignore-next-line
            $deals = $allDeals->getData()->deals;

            foreach ($deals as $deal) {
                if ($deal->properties->dealstage->value == config('services.hubspot.deal_stage')) {
                    $hubspotDeal = HubspotDeal::where('deal_id', $deal->dealId)->first();
                    if ($hubspotDeal) {
                        $user = User::where('email', $hubspotDeal->user_email)->first();

                        if ($order = Order::where('user_id', $user->id)->where('payment_status', OrderPaymentStatusEnum::PAID)->first()) {
                            $this->info("Moving $user->first_name deal from New Customer Stage to Closed Won Stage");
                            $hubspotService->updateDealStageForPaidOrder($order);
                        }
                    }
                }
            }
            // @phpstan-ignore-next-line
            $offset = $allDeals->offset;
            // @phpstan-ignore-next-line
            $hasMore = $allDeals->hasMore;
        }

        return Command::SUCCESS;
    }
}
