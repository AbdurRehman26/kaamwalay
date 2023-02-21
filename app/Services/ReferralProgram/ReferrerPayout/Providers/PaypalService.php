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
//            "sender_batch_id" => "RefPayouts-".$idsString,
            "sender_batch_id" => "RefPayouts-".date('Ymdhis').'-'.$idsString,
            "email_subject" => "You have a payout!",
            "email_message" => "You have received a payout! Thanks for using our service!"
        ];
    }
    public function pay(array $items, array $data = []): array
    {
        try {
            $itemsData = $this->getItemsRequestData($items);
            $senderBatchHeaderData = $this->getSenderBatchHeaderData($items);

            $requestData = [
                "items" => $itemsData,
                "sender_batch_header" => $senderBatchHeaderData,
            ];

            $response = $this->client->createBatchPayout($requestData);

            return [
                'request' => $requestData,
                'response' => json_decode(json_encode($response), associative: true),
                'payout_batch_id' => $response['batch_header']['payout_batch_id'],
                'batch_status' => $response['batch_header']['batch_status'],
            ];

        } catch (RequestException $e) {
            return ['message' => $e->getMessage()];
        }
    }

    public function verify(string $payoutBatchId): array
    {
        try {
            $response = $this->client->getBatchPayoutStatus($payoutBatchId);
            return [
                'response' => $response,
                'payout_batch_id' => $response['batch_header']['payout_batch_id'],
                'batch_status' => $response['batch_header']['batch_status'],
            ];
        } catch (RequestException $e) {
            return ['message' => $e->getMessage()];
        }
    }
}
