<?php

namespace App\Services\ReferralProgram\ReferrerPayout\Providers;

use App\Http\APIClients\PaypalClient;
use App\Models\PayoutStatus;
use App\Models\ReferrerPayout;
use App\Services\ReferralProgram\ReferrerPayout\Providers\Contracts\ReferrerPayoutProviderServiceInterface;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Collection;

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

            $detailsResponse = $this->getBatchDetails($response['batch_header']['payout_batch_id']);

            return array_merge([
                'request' => $requestData,
            ], $detailsResponse);

        } catch (RequestException $e) {
            return ['message' => $e->getMessage()];
        }
    }

    public function getBatchDetails(string $payoutBatchId): array
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

    public function storeItemsResponse(Collection $payouts, array $data): void {

        $responseItems = $data['response']['items'];

        // Match the payouts collection items with the response items, assuming that they could not always be in order
        foreach($payouts as $payout) {
            $filtered = array_values(array_filter($responseItems, function ($item) use ($payout) {
                return str_ends_with($item['payout_item']['sender_item_id'], '-'.$payout->id);
            }));

            if (count($filtered) > 0)
            {
                $transactionStatus = $filtered[0]['transaction_status'];

                $payout->update([
                    'request_payload' => $data['request'],
                    'response_payload' => json_encode($filtered[0]),
                    'initiated_at' => now(),
                    'transaction_id' => $filtered[0]['payout_item_id'],
                    'transaction_status' => $transactionStatus,
                    'paid_by' => $transactionStatus === 'SUCCESS' ? auth()->user()->id : null,
                    'payout_status_id' => $this->getPayoutStatusId($transactionStatus),
                    'completed_at' => $transactionStatus === 'SUCCESS' ? now() : null,
                ]);
            }
        }
    }

    protected function getPayoutStatusId(string $transactionStatus): int
    {
        switch ($transactionStatus) {
            case 'SUCCESS':
                return PayoutStatus::STATUS_COMPLETED;
            case 'FAILED':
            case 'RETURNED':
            case 'ONHOLD':
                return PayoutStatus::STATUS_FAILED;
            default:
                // Everything else (PENDING, UNCLAIMED, BLOCKED, REFUNDED, REVERSED) will be in process
                return PayoutStatus::STATUS_PROCESSING;
        }
    }
}
