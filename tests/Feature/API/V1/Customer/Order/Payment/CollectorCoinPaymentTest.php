<?php

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderPayment;
use App\Models\PaymentMethod;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
});

it('can verfy completion of AGS paid order', function () {
    config([
        'configuration.keys.web3_configurations.supported_networks' => '97',
    ]);

    config([
        'web3networks' => [
            97 => [
                'chain_id' => '0x61',
                'chain_name' => 'Binance Smart Chain - Testnet',
                'native_currency' => [
                    'name' => 'tBnb',
                    'symbol' => 'tBNB',
                    'decimals' => 18,
                ],
                'rpc_urls' => ['https://data-seed-prebsc-1-s1.binance.org:8545'],
                'block_explorer_urls' => ['https://testnet.bscscan.com'],
                'is_testnet' => true,
                'ags_token' => '0xb1f5a876724dcfd6408b7647e41fd739f74ec039',
                'ags_wallet' => env('TEST_WALLET'),
            ],
        ],
        ]);

    $bscTestTransactionHash = '0x7ee79769e935f914ec5ff3ccc10d767bf5800bc506f2df8e0c274034a3d61a52';
    $this->actingAs($this->user);
    $paymentMethod = PaymentMethod::factory()->create([
        'code' => 'ags',
    ]);
    $order = Order::factory()->for($this->user)->create([
        'payment_method_id' => $paymentMethod->id,
    ]);
    OrderItem::factory()->for($order)->create();
    OrderPayment::factory()->for($order)->create([
        'response' => json_encode(
            [
                'network' => 97,
                'txn_hash' => $bscTestTransactionHash,
                'amount' => 120,
            ]
        ),
        'payment_provider_reference_id' => $bscTestTransactionHash,
        'payment_method_id' => $paymentMethod->id,
    ]);

    $response = $this->postJson('/api/v1/customer/orders/' . $order->id . '/payments/verify-ags');

    $response->assertStatus(200);
    $response->assertJsonStructure([
        'transaction_hash', 'status',
    ]);
});
