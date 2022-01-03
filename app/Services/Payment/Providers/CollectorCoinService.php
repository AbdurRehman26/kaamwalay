<?php

namespace App\Services\Payment\Providers;

use App\Exceptions\API\Customer\Order\IncorrectOrderPayment;
use App\Models\Order;
use App\Models\OrderPayment;
use Web3\Web3;
use Web3\ValueObjects\Wei;

class CollectorCoinService
{
    // Status Values
    // 0: Fail
    // 1: Completed
    protected $web3;

    public function __construct(string $network){
        $this->web3 = new Web3(config('configuration.keys.web3_networks.' . $network));
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
        
        if ($transactionData['to'] !== config('configuration.web3_tokens.' . $data['txt'])
        || $transactionData['token_amount'] !== $data['amount']) {
            throw new IncorrectOrderPayment;
        }
        
        return true;
    }
}
