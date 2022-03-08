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
use App\Services\Admin\V2\OrderStatusHistoryService;
use App\Services\Order\Shipping\ShippingFeeService;
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


//test('collector coin discount is applied', function () {
//    $this->actingAs($this->user);
//
//    $discountPercentage = 10;
//    config(['robograding.collector_coin_discount_percentage' => $discountPercentage]);
//
//    $response = $this->postJson('/api/v2/customer/orders', [
//        'payment_plan' => [
//            'id' => $this->paymentPlan->id,
//        ],
//        'items' => [
//            [
//                'card_product' => [
//                    'id' => $this->cardProduct->id,
//                ],
//                'quantity' => 1,
//                'declared_value_per_unit' => 500,
//            ],
//        ],
//        'shipping_address' => [
//            'first_name' => 'First',
//            'last_name' => 'Last',
//            'address' => 'Test address',
//            'city' => 'Test',
//            'state' => 'AB',
//            'zip' => '12345',
//            'phone' => '1234567890',
//            'flat' => '43',
//            'save_for_later' => true,
//        ],
//        'billing_address' => [
//            'first_name' => 'First',
//            'last_name' => 'Last',
//            'address' => 'Test address',
//            'city' => 'Test',
//            'state' => 'AB',
//            'zip' => '12345',
//            'phone' => '1234567890',
//            'flat' => '43',
//            'same_as_shipping' => true,
//        ],
//        'customer_address' => [
//            'id' => null,
//        ],
//        'shipping_method' => [
//            'id' => $this->shippingMethod->id,
//        ],
//        'payment_method' => [
//            'id' => $this->paymentMethod->id,
//        ],
//        'payment_provider_reference' => [
//            'id' => '12345678',
//        ],
//    ]);
//
//    $shippingFee = ShippingFeeService::calculateForOrder(Order::first());
//    $response->assertSuccessful();
//    $response->assertJsonFragment([
//        'grand_total' => round($this->paymentPlan->price * (1 - ($discountPercentage / 100)) + $shippingFee, 2),
//    ]);
//});

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

    $response = $this->postJson('/api/v2/customer/orders/' . $order->id . '/payments/' . $bscTestTransactionHash);

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
        'order_status_id' => OrderStatus::PLACED,
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
        'order_status_id' => OrderStatus::PLACED,
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

    $response = $this->postJson("/api/v2/customer/orders/{$newOrder->id}/payments", [
        'transaction_hash' => $bscTestTransactionHash,
        'payment_method' => [
            'id' => $this->paymentMethod->id,
        ],
        'payment_provider_reference' => [
            'id' => '12345678',
        ],
    ]);

    $response->assertStatus(Response::HTTP_PAYMENT_REQUIRED);
    $response->assertJsonStructure([
        'message',
    ]);
    $response->assertJsonFragment([
        'message' => 'This transaction number has already been used.',
    ]);
});
