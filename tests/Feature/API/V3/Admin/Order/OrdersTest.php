<?php

use App\Models\CardProduct;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatus;
use App\Models\PaymentMethod;
use App\Models\PaymentPlan;
use App\Models\PaymentPlanRange;
use App\Models\ShippingMethod;
use App\Models\User;
use App\Models\UserCard;
use Database\Seeders\CardCategoriesSeeder;
use Database\Seeders\CardProductSeeder;
use Database\Seeders\CardSeriesSeeder;
use Database\Seeders\CardSetsSeeder;
use Database\Seeders\RolesSeeder;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Support\Facades\Event;

beforeEach(function () {
    $this->seed([
        RolesSeeder::class,
        CardCategoriesSeeder::class,
        CardSeriesSeeder::class,
        CardSetsSeeder::class,
        CardProductSeeder::class,
    ]);

    $this->user = User::factory()->withRole(config('permission.roles.admin'))->create();

    $this->orders = Order::factory()->count(5)->state(new Sequence(
        ['order_status_id' => OrderStatus::PLACED, 'created_at' => '2022-01-01 00:00:00'],
        ['order_status_id' => OrderStatus::CONFIRMED, 'created_at' => '2022-02-01 00:00:00'],
        ['order_status_id' => OrderStatus::GRADED, 'created_at' => '2022-03-01 00:00:00'],
        ['order_status_id' => OrderStatus::SHIPPED, 'created_at' => '2022-04-01 00:00:00'],
    ))->create();

    \App\Models\OrderStatusHistory::factory()->count(5)->sequence(
        ['order_status_id' => $this->orders[0]->order_status_id, 'order_id' => $this->orders[0]->id, 'user_id' => $this->orders[0]->user_id],
        ['order_status_id' => $this->orders[1]->order_status_id, 'order_id' => $this->orders[1]->id, 'user_id' => $this->orders[1]->user_id],
        ['order_status_id' => $this->orders[2]->order_status_id, 'order_id' => $this->orders[2]->id, 'user_id' => $this->orders[2]->user_id],
        ['order_status_id' => $this->orders[3]->order_status_id, 'order_id' => $this->orders[3]->id, 'user_id' => $this->orders[3]->user_id],
        ['order_status_id' => $this->orders[4]->order_status_id, 'order_id' => $this->orders[4]->id, 'user_id' => $this->orders[4]->user_id]
    )->create();

    OrderItem::factory()->count(5)
        ->state(new Sequence(
            [
                'order_id' => $this->orders[0]->id,
            ],
            [
                'order_id' => $this->orders[1]->id,
            ],
            [
                'order_id' => $this->orders[2]->id,
            ],
            [
                'order_id' => $this->orders[3]->id,
            ],
            [
                'order_id' => $this->orders[4]->id,
            ]
        ))
        ->create();

    UserCard::factory()->state(new Sequence(
        [
            'order_item_id' => OrderItem::first()->id,
            'certificate_number' => '000000100',
        ]
    ))->create();

    $this->paymentPlan = PaymentPlan::factory()->create(['max_protection_amount' => 1000000, 'price' => 10]);
    $this->paymentPlanRanges = PaymentPlanRange::factory()->count(5)->state(new Sequence(
        ['payment_plan_id' => $this->paymentPlan->id, 'min_cards' => 1, 'max_cards' => 20],
        ['payment_plan_id' => $this->paymentPlan->id, 'min_cards' => 21, 'max_cards' => 50],
        ['payment_plan_id' => $this->paymentPlan->id, 'min_cards' => 51, 'max_cards' => 100],
        ['payment_plan_id' => $this->paymentPlan->id, 'min_cards' => 101, 'max_cards' => 200],
        ['payment_plan_id' => $this->paymentPlan->id, 'min_cards' => 201, 'max_cards' => null],
    ))->create();
    $this->cardProduct = CardProduct::factory()->create();
    $this->shippingMethod = ShippingMethod::factory()->insured()->create();
    $this->paymentMethod = PaymentMethod::factory()->create(['code' => 'manual']);

    $this->actingAs($this->user);
});

uses()->group('admin', 'admin_orders');

test('an admin can place order for an user', function () {
    Event::fake();

    $customer = User::factory()->create();

    $response = $this->postJson('/api/v3/admin/orders', [
        'user_id' => $customer->id,
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
        'pay_now' => false,
    ]);
    $response->assertSuccessful();
    $response->assertJsonStructure([
        'data' => [
            'id',
            'order_number',
            'order_items',
            'payment_plan',
            'order_payment',
            'billing_address',
            'shipping_address',
            'shipping_method',
            'service_fee',
            'shipping_fee',
            'grand_total',
            'user',
            'created_by',
        ],
    ]);
    $response->assertJsonPath('data.user.id', $customer->id);
    $response->assertJsonPath('data.created_by.id', $this->user->id);
});

test('an admin can place order for an user and mark it paid immediately', function () {
    Event::fake();

    $customer = User::factory()->create();

    $response = $this->postJson('/api/v3/admin/orders', [
        'user_id' => $customer->id,
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
        'pay_now' => true,
        'payment_method' => [
            'id' => $this->paymentMethod->id,
        ],
    ]);
    $response->assertSuccessful();
    $response->assertJsonStructure([
        'data' => [
            'id',
            'order_number',
            'order_items',
            'payment_plan',
            'order_payment',
            'billing_address',
            'shipping_address',
            'shipping_method',
            'service_fee',
            'shipping_fee',
            'grand_total',
        ],
    ]);
});

test('correct service level price is assigned according to price ranges', function (int $numberOfCards, $priceRangeIndex) {
    Event::fake();

    $customer = User::factory()->create();

    $response = $this->postJson('/api/v3/admin/orders', [
        'user_id' => $customer->id,
        'payment_plan' => [
            'id' => $this->paymentPlan->id,
        ],
        'items' => [
            [
                'card_product' => [
                    'id' => $this->cardProduct->id,
                ],
                'quantity' => $numberOfCards,
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
        'pay_now' => false,
    ]);
    $response->assertSuccessful();
    $response->assertJsonStructure([
        'data' => [
            'id',
            'order_number',
            'order_items',
            'payment_plan',
            'order_payment',
            'billing_address',
            'shipping_address',
            'shipping_method',
            'service_fee',
            'shipping_fee',
            'grand_total',
            'user',
            'created_by',
        ],
    ]);
    $response->assertJsonPath('data.payment_plan.price', intval($this->paymentPlanRanges[$priceRangeIndex]->price));
})
    ->with([
        [11, 0],
        [21, 1],
        [61, 2],
        [121, 3],
        [211, 4],
    ]);