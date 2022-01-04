<?php

namespace App\Services\Payment\Providers;

use App\Exceptions\API\Customer\Order\IncorrectOrderPayment;
use App\Models\Order;
use App\Models\OrderPayment;
use App\Models\OrderStatus;
use Illuminate\Support\Facades\Http;
use Stripe\Exception\ApiErrorException;
use Web3\Web3;
use Web3\ValueObjects\Wei;

class CollectorCoinService
{
    // Status Values
    // 0: Fail
    // 1: Completed
    protected $web3;
    protected $networkId;

    public function __construct(int $networkId){
        $this->networkId = $networkId;
        $this->web3 = new Web3(config('web3networks.' . $this->networkId. '.rpc_urls')[0]);
    }

    public function getTransaction(string $txn): array {
        $transaction = $this->web3->eth()->getTransactionByHash($txn);

        $transaction['token_amount'] = Wei::fromHex(substr($transaction['input'], 74))->toEth();

        return $transaction;
    }

    public function getTransactionDetails(string $txn): array {
        return $this->web3->eth()->getTransactionReceipt($txn);
    }

    public function charge(Order $order, array $data): array{

        try {
            $transactionData = $this->getTransaction($data['txn']);
            //Get AGS amount from USD (Order grand total)
            $response = json_decode($order->firstOrderPayment->response, true);
            $data['amount'] = $response['amount'];

            $this->validateTransaction($data, $transactionData);

            // Include Transaction Hash in response in case validation goes through
            $response['txn_hash'] = $data['txn'];

            return [
                'success' => true,
                'request' => $data,
                'response' => $response,
                'payment_provider_reference_id' => $order->firstOrderPayment->payment_provider_reference_id,
                'amount' => $order->firstOrderPayment->amount,
                'type' => OrderPayment::TYPE_ORDER_PAYMENT,
                'notes' => null,
            ];

        } catch ( IncorrectOrderPayment $e) {
            return [
                'message' => $e->getMessage(),
            ];
        }

        return ['message' => 'Unable to handle your request at the moment.'];
    }

    public function verify(Order $order, string $transactionHash): bool | array
    {
        try {
            return $this->validateOrderIsPaid($order, $transactionHash);
        } catch (ApiErrorException $e) {
            return false;
        }
    }

    public function getAgsPriceFromUsd(float $value): float
    {
        $ags = 0.0;
        $divider = 1;

        $baseUrl = 'https://api.coingecko.com/api/v3/simple/token_price';
        $networkData = config('web3networks.' . $this->networkId);

        if ($networkData['is_testnet']) {
            $divider = config('configuration.keys.web3_configurations.testnet_token_value', 1);
        }

        $web3BscToken = $networkData['ags_token'];
        if ($this->networkId === 56) { //Is BSC
            $response = Http::get($baseUrl . '/binance-smart-chain?contract_addresses='. $web3BscToken .'&vs_currencies=usd');

            $divider = $response->json()[$web3BscToken]['usd'];
        } else if ($this->networkId === 1) { //Is ETH
            $response = Http::get($baseUrl . '/ethereum?contract_addresses='. $web3BscToken .'&vs_currencies=usd');

            $divider = $response->json()[$web3BscToken]['usd'];
        }

        $ags = $value / $divider;

        return $ags;
    }

    public function calculateFee(OrderPayment $orderPayment): float
    {
        return 0.0;
    }

    protected function validateOrderIsPaid(Order $order): array
    {
        $transactionHash = $order->firstOrderPayment->payment_provider_reference_id;

        //TODO: Check if we also should support this for confirmed/graded orders
        if ($order->order_status_id === OrderStatus::PLACED)
        {
            return [
                'transaction_hash' => $transactionHash,
                'status' => 'success'
            ];
        }
        else {
            return $this->validateTransactionIsSuccessful($transactionHash);
        }

        return [
            'transaction_hash' => $transactionHash,
            'status' => 'processing'
        ];
    }

    protected function validateTransactionIsSuccessful(string $transactionHash): array
    {
        $transactionDetails = $this->getTransactionDetails($transactionHash);

        switch ($transactionDetails['status']) {
            case '0':
                $status = 'fail';
                break;

            case '1':
                $status = 'success';
                break;

            default:
                $status = 'processing';
                break;
        }
        return [
            'transaction_hash' => $transactionHash,
            'status' => $status,
        ];
    }

    protected function validateTransaction(array $data, array $transactionData): bool {

        if ($transactionData['to'] !== config('web3networks.' . $this->networkId. '.ags_token')
        || $transactionData['token_amount'] !== $data['amount']) {
            throw new IncorrectOrderPayment;
        }

        return true;
    }
}
