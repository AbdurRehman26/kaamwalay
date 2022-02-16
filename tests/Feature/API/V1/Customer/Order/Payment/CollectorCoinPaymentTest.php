<?php

use App\Models\CardProduct;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderPayment;
use App\Models\OrderStatus;
use App\Models\PaymentMethod;
use App\Models\PaymentPlan;
use App\Models\ShippingMethod;
use App\Models\User;
use App\Services\Admin\OrderStatusHistoryService;
use App\Services\Order\Shipping\ShippingFeeService;
use App\Services\Payment\Providers\CollectorCoinService;
use Mockery\MockInterface;
use Symfony\Component\HttpFoundation\Response;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->paymentPlan = PaymentPlan::factory()->create(['max_protection_amount' => 1000000]);
    $this->cardProduct = CardProduct::factory()->create();
    $this->shippingMethod = ShippingMethod::factory()->create();
    $this->paymentMethod = PaymentMethod::factory()->create([
        'code' => 'collector_coin',
    ]);
    $this->orderStatusHistoryService = resolve(OrderStatusHistoryService::class);
});


test('collector coin discount is applied', function () {
    $this->actingAs($this->user);

    $discountPercentage = 10;
    config(['robograding.collector_coin_discount_percentage' => $discountPercentage]);

    $response = $this->postJson('/api/v1/customer/orders', [
        'payment_plan' => [
            'id' => $this->paymentPlan->id,
        ],
        'items' => [
            [
                'card_product' => [
                    'id' => $this->cardProduct->id,
                ],
                'quantity' => 1,
                'declared_value_per_unit' => 500,
            ],
        ],
        'shipping_address' => [
            'first_name' => 'First',
            'last_name' => 'Last',
            'address' => 'Test address',
            'city' => 'Test',
            'state' => 'AB',
            'zip' => '12345',
            'phone' => '1234567890',
            'flat' => '43',
            'save_for_later' => true,
        ],
        'billing_address' => [
            'first_name' => 'First',
            'last_name' => 'Last',
            'address' => 'Test address',
            'city' => 'Test',
            'state' => 'AB',
            'zip' => '12345',
            'phone' => '1234567890',
            'flat' => '43',
            'same_as_shipping' => true,
        ],
        'customer_address' => [
            'id' => null,
        ],
        'shipping_method' => [
            'id' => $this->shippingMethod->id,
        ],
        'payment_method' => [
            'id' => $this->paymentMethod->id,
        ],
        'payment_provider_reference' => [
            'id' => '12345678',
        ],
    ]);

    $shippingFee = ShippingFeeService::calculateForOrder(Order::first());
    $response->assertSuccessful();
    $response->assertJsonFragment([
        'grand_total' => round($this->paymentPlan->price * (1 - ($discountPercentage / 100)) + $shippingFee, 2),
    ]);
});

it('can verfy completion of collector coin paid order', function () {
    config([
        'robograding.web3.supported_networks' => '97',
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
                'collector_coin_token' => '0xb1f5a876724dcfd6408b7647e41fd739f74ec039',
                'collector_coin_wallet' => env('TEST_WALLET'),
            ],
        ],
    ]);

    $bscTestTransactionHash = '0x7ee79769e935f914ec5ff3ccc10d767bf5800bc506f2df8e0c274034a3d61a52';
    $this->actingAs($this->user);

    $this->partialMock(CollectorCoinService::class, function (MockInterface $mock) use ($bscTestTransactionHash) {
        $mock->shouldReceive('getTransactionDetails')->withArgs([$bscTestTransactionHash])->andReturn([
            "blockHash" => "0x5d13e02cfc5f16323bc3e39ba8e407cc3d4ee7c0002abdb1aaf849dfb745c9cb",
            "blockNumber" => "15541205",
            "contractAddress" => null,
            "cumulativeGasUsed" => "1744572",
            "from" => "0x7ffcff7c927e268c2d7af93e07f37f2449eafe56",
            "gasUsed" => "36870",
            "logs" => [
                [
                    "address" => "0xb1f5a876724dcfd6408b7647e41fd739f74ec039",
                    "topics" => [
                        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                        "0x0000000000000000000000007ffcff7c927e268c2d7af93e07f37f2449eafe56",
                        "0x000000000000000000000000b2a7f8ba330ebe430521eb13f615bd8f15bf3c4d",
                    ],
                    "data" => "0x0000000000000000000000000000000000000000000000068155a43676e00000",
                    "blockNumber" => "15541205",
                    "transactionHash" => "0x7ee79769e935f914ec5ff3ccc10d767bf5800bc506f2df8e0c274034a3d61a52",
                    "transactionIndex" => "7",
                    "blockHash" => "0x5d13e02cfc5f16323bc3e39ba8e407cc3d4ee7c0002abdb1aaf849dfb745c9cb",
                    "logIndex" => "31",
                    "removed" => false,
                ],
            ],
            "logsBloom" => "0x00000000000000000000000000000000000000000000000000000000004000000000000000000000000000000400000000000000020000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000210000000000000000000000000000000200000000000000000000000080000000000000000000000000000000000004000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000",
            "status" => "1",
            "to" => "0xb1f5a876724dcfd6408b7647e41fd739f74ec039",
            "transactionHash" => "0x7ee79769e935f914ec5ff3ccc10d767bf5800bc506f2df8e0c274034a3d61a52",
            "transactionIndex" => "7",
            "type" => "0x0",
        ]);
    });

    $order = Order::factory()->for($this->user)->create([
        'payment_method_id' => $this->paymentMethod->id,
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
        'payment_method_id' => $this->paymentMethod->id,
    ]);

    $response = $this->postJson('/api/v1/customer/orders/' . $order->id . '/payments/' . $bscTestTransactionHash);

    $response->assertStatus(200);
    $response->assertJsonStructure([
        'message',
    ]);
    $response->assertJsonFragment([
        'message' => 'Payment verified successfully',
    ]);
});

it('fails to charge order if transaction hash has already been used', function () {
    config([
        'robograding.web3.supported_networks' => '97',
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
                'collector_coin_token' => '0xb1f5a876724dcfd6408b7647e41fd739f74ec039',
                'collector_coin_wallet' => env('TEST_WALLET'),
            ],
        ],
    ]);

    $bscTestTransactionHash = '0x7ee79769e935f914ec5ff3ccc10d767bf5800bc506f2df8e0c274034a3d61a52';
    $this->actingAs($this->user);

    // Make a previous order
    $order = Order::factory()->for($this->user)->create([
        'payment_method_id' => $this->paymentMethod->id,
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
        'payment_method_id' => $this->paymentMethod->id,
    ]);

    //Attempt to charge a new order
    $newOrder = Order::factory()->for($this->user)->create([
        'payment_method_id' => $this->paymentMethod->id,
        'coupon_id' => null,
        'order_status_id' => OrderStatus::PAYMENT_PENDING,
    ]);
    OrderItem::factory()->for($newOrder)->create();
    OrderPayment::factory()->for($newOrder)->create([
        'response' => json_encode(
            [
                'network' => 97,
                'txn_hash' => $bscTestTransactionHash,
                'amount' => 120,
            ]
        ),
        'payment_provider_reference_id' => $bscTestTransactionHash,
        'payment_method_id' => $this->paymentMethod->id,
    ]);

    OrderPayment::factory()->create([
        'order_id' => $newOrder->id,
        'payment_method_id' => $this->paymentMethod->id,
        'payment_provider_reference_id' => Str::random(25),
    ]);

    $response = $this->postJson("/api/v1/customer/orders/{$newOrder->id}/payments", [
        'transaction_hash' => $bscTestTransactionHash,
    ]);

    $response->assertStatus(Response::HTTP_PAYMENT_REQUIRED);
    $response->assertJsonStructure([
        'message',
    ]);
    $response->assertJsonFragment([
        'message' => 'This transaction number has already been used.',
    ]);
});
