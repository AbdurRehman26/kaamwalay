<?php

namespace App\Services\ReferralProgram\ReferrerPayout\Providers;

use App\Http\APIClients\PaypalClient;
use App\Services\ReferralProgram\ReferrerPayout\Providers\Contracts\ReferrerPayoutProviderServiceInterface;
use Illuminate\Http\Client\RequestException;

class PaypalService implements ReferrerPayoutProviderServiceInterface
{
    public function __construct(protected PaypalClient $client)
    {
    }

    protected function getSenderItemId(array $itemData): string
    {
        return date('Ymdhis'). '-' .$itemData['id'];
    }

    protected function getItemsRequestData(array $items): array
    {
        return array_map(function ($item) {
            return [
                "receiver" => $item['payout_account'],
                "amount" => [
                    "currency" => "USD",
                    "value" => $item['amount'],
                ],
                "recipient_type" => "EMAIL",
                "sender_item_id" => $this->getSenderItemId($item),
            ];
        }, $items);
    }

    protected function getSenderBatchHeaderData(array $items): array
    {
        $idsString = implode('|', array_map(function($item) {
            return $item['id'];
        }, $items));

        return [
            "sender_batch_id" => "RefPayouts-".$idsString,
            "email_subject" => "You have a payout!",
            "email_message" => "You have received a payout! Thanks for using our service!"
        ];
    }
    public function pay(array $items, array $data = []): array
    {
        try {
            $itemsData = $this->getItemsRequestData($items);
            $senderBatchHeaderData = $this->getSenderBatchHeaderData($items);

            dd($itemsData, $senderBatchHeaderData);

        } catch (RequestException $e) {
            return ['message' => $e->getMessage()];
        }
    }
}
