<?php

namespace App\Services\ReferralProgram\ReferrerPayout\Providers;

use App\Http\APIClients\PaypalClient;
use App\Models\ReferrerPayout;
use App\Models\ReferrerPayoutStatus;
use App\Services\ReferralProgram\ReferrerPayout\Providers\Contracts\ReferrerPayoutProviderServiceHandshakeInterface;
use App\Services\ReferralProgram\ReferrerPayout\Providers\Contracts\ReferrerPayoutProviderServicePayInterface;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Collection;

class PaypalPayoutService implements ReferrerPayoutProviderServicePayInterface, ReferrerPayoutProviderServiceHandshakeInterface
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
        $idsString = implode('|', array_map(function ($item) {
            return $item['id'];
        }, $items));

        return [
            "sender_batch_id" => "RefPayouts-".date('Ymdhis').'-'.$idsString,
            "email_subject" => "You have a payout!",
            "email_message" => "You have received a payout! Thanks for using our service!",
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

            if ($response['batch_header']['batch_status'] === 'DENIED') {
                return [
                    'result' => 'FAILED',
                    'request' => $requestData,
                    'response' => $response,
                    'payout_batch_id' => $response['batch_header']['payout_batch_id'],
                    'batch_status' => $response['batch_header']['batch_status'],
                ];
            }

            $detailsResponse = $this->getBatchDetails($response['batch_header']['payout_batch_id']);

            return array_merge([
                'result' => 'OK',
                'request' => $requestData,
            ], $detailsResponse);
        } catch (RequestException $e) {
            return ['message' => $e->getMessage()];
        }
    }

    public function getBatchDetails(string $payoutBatchId): array
    {
        try {
            $response = $this->client->getBatchPayoutStatus($payoutBatchId, ['page_size' => 1000]);

            return [
                'response' => $response,
                'payout_batch_id' => $response['batch_header']['payout_batch_id'],
                'batch_status' => $response['batch_header']['batch_status'],
            ];
        } catch (RequestException $e) {
            return ['message' => $e->getMessage()];
        }
    }

    /**
     * @param  Collection<int, ReferrerPayout>  $payouts
     */
    public function storeItemsResponse(Collection $payouts, array $data): void
    {
        $responseItems = $data['response']['items'];

        // Match the payouts collection items with the response items, assuming that they could not always be in order
        foreach ($payouts as $payout) {
            $filtered = array_values(array_filter($responseItems, function ($item) use ($payout) {
                return str_ends_with($item['payout_item']['sender_item_id'], '-'.$payout->id);
            }));

            if (count($filtered) > 0) {
                $transactionStatus = $filtered[0]['transaction_status'];

                $payout->update([
                    'request_payload' => $data['request'],
                    'response_payload' => json_encode($filtered[0]),
                    'transaction_id' => $filtered[0]['payout_item_id'],
                    'transaction_status' => $transactionStatus,
                    'referrer_payout_status_id' => $this->getPayoutStatusId($transactionStatus),
                    'completed_at' => $transactionStatus === 'SUCCESS' ? now() : null,
                ]);

                if ($this->getPayoutStatusId($transactionStatus) === ReferrerPayoutStatus::STATUS_FAILED) {
                    $this->processFailedPayout($payout);
                }
            }
        }
    }

    public function handshake(ReferrerPayout $payout, array $data = []): array
    {
        try {
            $response = $this->client->getPayoutItemDetails($payout->transaction_id);
            $transactionStatus = $response['transaction_status'];

            $payout->update([
                'response_payload' => json_encode($response),
                'transaction_status' => $transactionStatus,
                'referrer_payout_status_id' => $this->getPayoutStatusId($transactionStatus),
                'completed_at' => $transactionStatus === 'SUCCESS' ? now() : null,
            ]);

            if ($this->getPayoutStatusId($transactionStatus) === ReferrerPayoutStatus::STATUS_FAILED) {
                $this->processFailedPayout($payout);
            }

            return [
                'payout_id' => $payout->id,
                'response' => json_encode($response),
                'transaction_id' => $payout->transaction_id,
                'transaction_status' => $transactionStatus,
            ];
        } catch (RequestException $e) {
            return ['message' => $e->getMessage()];
        }
    }

    protected function getPayoutStatusId(string $transactionStatus): int
    {
        switch ($transactionStatus) {
            case 'SUCCESS':
                return ReferrerPayoutStatus::STATUS_COMPLETED;
            case 'FAILED':
            case 'RETURNED':
                return ReferrerPayoutStatus::STATUS_FAILED;
            default:
                // Everything else (PENDING, UNCLAIMED, BLOCKED, REFUNDED, REVERSED, ONHOLD) will be in process
                return ReferrerPayoutStatus::STATUS_PROCESSING;
        }
    }

    protected function processFailedPayout(ReferrerPayout $payout): void
    {
        $payout->user->referrer->increment('withdrawable_commission', $payout->amount);
    }
}
