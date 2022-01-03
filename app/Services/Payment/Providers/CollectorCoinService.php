<?php

namespace App\Services\Payment\Providers;

use App\Exceptions\API\Customer\Order\IncorrectOrderPayment;
use App\Models\Order;
use App\Models\OrderPayment;
use Illuminate\Support\Facades\Http;
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
            $data['amount'] = $this->getAgsPriceFromUsd($order->grand_total, $data['network']);

            $this->validateTransaction($data, $transactionData);
    
            $orderPayment = $order->firstOrderPayment;
            $orderPayment->amount = $data['amount'];
            $orderPayment->payment_provider_reference_id = $data['txn'];
            $orderPayment->update();
    
            $order->payment_network = $data['network'];
            $order->save();
            
            return [
                'success' => true,
                'request' => $data,
                'response' => $transactionData,
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

    protected function validateTransaction(array $data, array $transactionData): bool {
        
        if ($transactionData['to'] !== config('web3networks.' . $this->networkId. '.ags_token')
        || $transactionData['token_amount'] !== $data['amount']) {
            throw new IncorrectOrderPayment;
        }
        
        return true;
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
}
