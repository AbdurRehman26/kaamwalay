<?php

namespace Tests\Feature\API\Admin\Order;

use App\Events\API\Admin\Order\RefundSuccessful;
use App\Events\Wallet\TransactionHappened;
use App\Models\Order;
use App\Models\OrderPayment;
use App\Models\OrderStatus;
use App\Models\OrderStatusHistory;
use App\Models\User;
use App\Models\Wallet;
use Database\Seeders\CardCategoriesSeeder;
use Database\Seeders\CardProductSeeder;
use Database\Seeders\CardSeriesSeeder;
use Database\Seeders\CardSetsSeeder;
use Database\Seeders\RolesSeeder;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

uses(WithFaker::class);

beforeEach(function () {
    $this->seed([
        RolesSeeder::class,
        CardCategoriesSeeder::class,
        CardSeriesSeeder::class,
        CardSetsSeeder::class,
        CardProductSeeder::class,
    ]);

    $user = User::factory()->withRole(config('permission.roles.admin'))->create();

    $this->order = Order::factory()->create([
        'order_status_id' => OrderStatus::PLACED,
        'payment_method_id' => 1,
    ]);

    Wallet::factory()->create([
        'user_id' => $this->order->user_id,
    ]);

    $this->orderPayment = OrderPayment::factory()->create([
        'order_id' => $this->order->id,
        'payment_method_id' => 1,
        'response' => json_encode(['id' => Str::random(25)]),
        'payment_provider_reference_id' => Str::random(25),
        'amount' => $this->faker->randomFloat(2, 50, 70),
        'type' => OrderPayment::TYPE_ORDER_PAYMENT,
    ]);

    OrderStatusHistory::factory()->create([
        'order_status_id' => $this->order->order_status_id,
        'order_id' => $this->order->id,
        'user_id' => $this->order->user_id,
    ]);
    $this->actingAs($user);
});

test('admin can refund partial amount of a charge', function () {
    Event::fake();
    $this->postJson(route('payments.refund', ['order' => $this->order]), [
        'notes' => $this->faker->sentence(),
        'amount' => '10.00',
        'add_to_wallet' => false,
    ])->assertStatus(Response::HTTP_CREATED);

    Event::assertDispatched(RefundSuccessful::class);
    expect($this->order->refunds()->count())->toEqual(1);
    expect($this->order->orderPayments()->count())->toEqual(2);
});

test('admin can not refund more than the charged amount', function () {
    $this->postJson(route('payments.refund', ['order' => $this->order]), [
        'notes' => $this->faker->sentence(),
        'amount' => $this->orderPayment->amount + 1,
    ])->assertStatus(Response::HTTP_UNPROCESSABLE_ENTITY);
});

test('admin can not refund a transaction with type refund', function () {
    $this->postJson(route('payments.refund', ['order' => $this->order]), [
        'notes' => $this->faker->sentence(),
        'amount' => $this->orderPayment->amount + 1,
    ])->assertStatus(Response::HTTP_UNPROCESSABLE_ENTITY);
});

// TODO: add more tests
test('admin can refund partial amount to a wallet', function () {
    Event::fake();
    $this->postJson(route('payments.refund', ['order' => $this->order]), [
        'notes' => $this->faker->sentence(),
        'amount' => '10.00',
        'add_to_wallet' => true,
    ])->assertStatus(Response::HTTP_CREATED);

    Event::assertDispatched(RefundSuccessful::class);
    Event::assertDispatched(TransactionHappened::class);

    expect($this->order->refunds()->count())->toEqual(1);
    expect($this->order->orderPayments()->count())->toEqual(2);
});
