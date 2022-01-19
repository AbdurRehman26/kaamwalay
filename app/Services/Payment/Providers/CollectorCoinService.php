<?php

namespace App\Services\Payment\Providers;

use App\Exceptions\API\Customer\Order\PaymentBlockchainNetworkNotSupported;
use App\Exceptions\Services\Payment\OrderPaymentIsIncorrect;
use App\Exceptions\Services\Payment\TransactionDetailsCouldNotBeObtained;
use App\Exceptions\Services\Payment\TransactionHashIsAlreadyInUse;
use App\Models\Order;
use App\Models\OrderPayment;
use App\Models\OrderStatus;
use App\Services\Payment\Providers\Contracts\PaymentProviderServiceInterface;
use App\Services\Payment\Providers\Contracts\PaymentProviderVerificationInterface;
use App\Services\Payment\Providers\Contracts\PaymentProviderHandshakeInterface;
use Exception;
use Illuminate\Support\Facades\Http;
use TypeError;
use Web3\ValueObjects\Wei;
use Web3\Web3;

class CollectorCoinService implements PaymentProviderServiceInterface, PaymentProviderVerificationInterface, PaymentProviderHandshakeInterface
{
    // Status Values
    public const FAILED = '0';
    public const COMPLETED = '1';

    protected const RETRY_WAIT_SECONDS = 3;
    protected const MAX_RETRIES_NUMBER = 10;
    
    protected Web3 $web3;

    protected int $paymentBlockChainNetworkId;

    public function getTransaction(string $txn, int $retryCount = 0): array
    {
        try {
            $transaction = $this->web3->eth()->getTransactionByHash($txn);

            // Extract information from 'input'
            // 0xa9059cbb000000000000000000000000b2a7f8ba330ebe430521eb13f615bd8f15bf3c4d0000000000000000000000000000000000000000000000068155a43676e00000
            // Where the first 34 bits represent text of the function signature (0xa9059cbb)
            // The next 256 bit block represent the address where token is sent to (000000000000000000000000b2a7f8ba330ebe430521eb13f615bd8f15bf3c4d)
            // And next block is the pa id amount (in hex) (0000000000000000000000000000000000000000000000068155a43676e00000)

            // Get destination wallet from input's first 256 bit block
            $transaction['destination_wallet'] = preg_replace('/^[0]+/', '0x', substr($transaction['input'], 10, 64));
            
            // Get correct token amount
            $transaction['token_amount'] = Wei::fromHex(substr($transaction['input'], 74, 64))->toEth();
            
        } catch (TypeError $te) {

            if ($retryCount < self::MAX_RETRIES_NUMBER) {
                sleep(self::RETRY_WAIT_SECONDS);
                $transaction = $this->getTransaction($txn, $retryCount + 1);
            } else {
                throw new TransactionDetailsCouldNotBeObtained;
            }

        }

        return $transaction;
    }

    public function getTransactionDetails(string $txn): array
    {
        return $this->web3->eth()->getTransactionReceipt($txn);
    }

    public function charge(Order $order, array $data = []): array
    {
        
        try {
            $this->validateTransactionHashIsNotDuplicate($order, $data['transaction_hash']);
            
            $orderPayment = $order->firstOrderPayment;
            
            $this->initializeWeb3FromOrderPayment($orderPayment);

            //Get Collector Coin amount from USD (Order grand total)
            $response = json_decode($orderPayment->response, true);
            $data['amount'] = $response['amount'];
            
            $transactionData = $this->getTransaction($data['transaction_hash']);
            
            $this->validateTransaction($data, $transactionData);

            // Include Transaction Hash and destination wallet in response in case validation goes through
            $response['txn_hash'] = $data['transaction_hash'];
            $response['destination_wallet'] = $transactionData['destination_wallet'];

            return [
                'success' => true,
                'request' => $data,
                'response' => $response,
                'payment_provider_reference_id' => $data['transaction_hash'],
                'amount' => $orderPayment->amount,
                'type' => OrderPayment::TYPE_ORDER_PAYMENT,
                'notes' => null,
            ];
        } catch (OrderPaymentIsIncorrect | TransactionHashIsAlreadyInUse | TransactionDetailsCouldNotBeObtained $e) {
            return [
                'message' => $e->getMessage(),
            ];
        } catch (Exception $e) {
            return ['message' => 'Unable to handle your request at the moment.'];
        }
    }

    public function verify(Order $order, string $transactionHash): bool
    {
        $orderPayment = $order->firstOrderPayment;
            
        $this->initializeWeb3FromOrderPayment($orderPayment);

        // With this, we make sure that transaction coming from request matches the one in DB before marking anything as paid
        if (json_decode($orderPayment->response, true)['txn_hash'] !== $transactionHash) {
            return false;
        }
    
        //TODO: Check if we also should support this for confirmed/graded orders
        if ($order->order_status_id === OrderStatus::PLACED) {
            return true;
        } else {
            return $this->validateTransactionIsSuccessful($transactionHash);
        }
    }

    public function processHandshake(Order $order, string $transactionHash): bool
    {
        $orderPayment = $order->firstOrderPayment;
            
        $this->initializeWeb3FromOrderPayment($orderPayment);

        // With this, we make sure that transaction coming from request matches the one in DB before marking anything as paid
        if (json_decode($orderPayment->response, true)['txn_hash'] !== $transactionHash) {
            return false;
        }
    
        //TODO: Check if we also should support this for confirmed/graded orders
        if ($order->order_status_id === OrderStatus::PLACED) {
            return true;
        } else {
            return $this->validateTransactionIsSuccessful($transactionHash);
        }
    }

    public function refund(Order $order, array $data): array
    {
        return [];
    }

    public function getCollectorCoinPriceFromUsd(int $paymentBlockChainNetworkId, float $value): float
    {
        $divider = 1;

        $baseUrl = 'https://api.coingecko.com/api/v3/simple/token_price';
        $networkData = config('web3networks.' . $paymentBlockChainNetworkId, 97); #Use Binance Smart Chain Testnet as default

        if ($networkData['is_testnet']) {
            $divider = config('robograding.web3.testnet_token_value');
        }

        $web3BscToken = $networkData['collector_coin_token'];
        if ($paymentBlockChainNetworkId === 56) { //Is BSC
            $response = Http::get($baseUrl . '/binance-smart-chain?contract_addresses='. $web3BscToken .'&vs_currencies=usd');

            $divider = $response->json()[$web3BscToken]['usd'];
        } elseif ($paymentBlockChainNetworkId === 1) { //Is ETH
            $response = Http::get($baseUrl . '/ethereum?contract_addresses='. $web3BscToken .'&vs_currencies=usd');

            $divider = $response->json()[$web3BscToken]['usd'];
        }

        $collectorCoin = $value / $divider;

        return round($collectorCoin, 2);
    }

    public function calculateFee(OrderPayment $orderPayment): float
    {
        return 0.0;
    }

    protected function initializeWeb3FromOrderPayment(OrderPayment $orderPayment): void {
        // Initialize instance network id and Web3
        $this->paymentBlockChainNetworkId = json_decode($orderPayment->response, true)['network'];

        throw_unless(
            in_array($this->paymentBlockChainNetworkId, explode(',', config('robograding.web3.supported_networks'))),
            PaymentBlockchainNetworkNotSupported::class
        );

        $this->web3 = new Web3(config('web3networks.' . $this->paymentBlockChainNetworkId. '.rpc_urls')[0]);
        
    }

    protected function validateTransactionIsSuccessful(string $transactionHash): bool
    {
        $transactionDetails = $this->getTransactionDetails($transactionHash);

        return $transactionDetails['status'] === self::COMPLETED;
    }

    protected function validateTransaction(array $data, array $transactionData): bool
    {
        $amountThresholdPercentage = (float) 2;

        //Verify that transaction is going to correct destination and amount is between 2% tange
        if (strtolower($transactionData['destination_wallet']) !== strtolower(config('web3networks.' . $this->paymentBlockChainNetworkId. '.collector_coin_wallet'))
        || $transactionData['token_amount'] < $data['amount'] * (1 - ($amountThresholdPercentage / 100))
        || $transactionData['token_amount'] > $data['amount'] * (1 + ($amountThresholdPercentage / 100))) {
            throw new OrderPaymentIsIncorrect;
        }

        return true;
    }

    protected function validateTransactionHashIsNotDuplicate(Order $order, string $transactionHash): bool
    {
        $duplicatePayments = OrderPayment::whereRelation('paymentMethod', 'code', 'collector_coin')
        ->where('id', '<>', $order->firstOrderPayment->id)
        ->where('payment_provider_reference_id', $transactionHash)
        ->count();

        if ($duplicatePayments > 0) {
            throw new TransactionHashIsAlreadyInUse;
        }

        return true;
    }

}
