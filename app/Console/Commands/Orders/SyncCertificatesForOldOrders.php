<?php

namespace App\Console\Commands\Orders;

use App\Models\UserCard;
use App\Models\UserCardCertificate;
use Illuminate\Console\Command;
use Illuminate\Database\Eloquent\Collection as DatabaseCollection;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;

class SyncCertificatesForOldOrders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'orders:sync-certificates-for-old-orders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'It syncs certificates for old orders which were created prior to Admin panel launch, but AGS graded those cards directly.';

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
    public function handle(): int
    {
        $fileName = $this->ask('Filename (storage/app/)');

        $data = collect(json_decode(Storage::get($fileName)))->map(function ($cardData) {
            return [
                'order_number' => $cardData->order_id,
                'card_number' => $cardData->card_number,
                'card_set_name' => $cardData->set_name,
                'certificate_number' => $cardData->certificate_id,
            ];
        })->groupBy('order_number')->transform(function (Collection $orderCards) {
            return $orderCards->groupBy(function ($item) {
                return $item['card_number'] . '|' . $item['card_set_name'];
            });
        });

        $data->each(function (Collection $forSingleOrder, string $orderNumber) {
            $forSingleOrder->each(function (Collection $forOneTypeOfCard, string $cardIdentifier) use ($orderNumber) {
                /** @var DatabaseCollection $userCards */
                $userCards = UserCard::join('order_items', 'order_items.id', '=', 'user_cards.order_item_id')
                    ->join('orders', 'orders.id', '=', 'order_items.order_id')
                    ->join('card_products', 'card_products.id', '=', 'order_items.card_product_id')
                    ->join('card_sets', 'card_sets.id', '=', 'card_products.card_set_id')
                    ->where('orders.order_number', $orderNumber)
                    ->where('card_products.card_number', explode('|', $cardIdentifier)[0])
                    ->where('card_sets.name', explode('|', $cardIdentifier)[1])
                    ->select(['user_cards.*'])
                    ->get();

                $userCards->each(function (UserCard $userCard, $key) use ($forOneTypeOfCard, $orderNumber) {
                    try {
                        $this->info('Order # ' . $orderNumber);
                        $this->info('Old Certificate ID: ' . $userCard->certificate_number);

                        $userCard->certificate_number = $forOneTypeOfCard[$key]['certificate_number'];
                        $userCard->save();

                        /** @var UserCardCertificate $userCardCertificate */
                        $userCardCertificate = $userCard->userCardCertificate;
                        $userCardCertificate->number = $userCard->certificate_number;
                        $userCardCertificate->save();

                        $this->info('New Certificate ID: ' . $userCard->certificate_number);
                        $this->newLine();
                    } catch (\Exception $e) {
                        $this->info('Issue occurred while processing data: ' . json_encode($forOneTypeOfCard[$key]));
                        $this->info($e->getMessage());
                    }
                });
            });
        });

        return 0;
    }
}
