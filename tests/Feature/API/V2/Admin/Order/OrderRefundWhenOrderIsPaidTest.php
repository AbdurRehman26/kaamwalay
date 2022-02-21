<?php

namespace Tests\Feature\API\Admin\Order;

use App\Enums\Order\OrderPaymentStatusEnum;
use App\Events\API\Admin\Order\RefundSuccessful;
use App\Events\Wallet\TransactionHappened;
use App\Models\Order;
use App\Models\OrderPayment;
use App\Models\OrderStatus;
use App\Models\OrderStatusHistory;
use App\Models\PaymentMethod;
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
use function Pest\Laravel\actingAs;
use function Pest\Laravel\postJson;
use function Pest\Laravel\seed;
use Symfony\Component\HttpFoundation\Response;

uses(WithFaker::class);

beforeEach(function () {
    seed([
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
        'payment_status' => OrderPaymentStatusEnum::PAID,
    ]);

    Wallet::factory()->create([
        'user_id' => $this->order->user_id,
    ]);

    $this->orderPayment = OrderPayment::factory()->create([
        'order_id' => $this->order->id,
        'payment_method_id' => 1,
        'response' => json_encode(['id' => Str::random(25)]),
        'payment_provider_reference_id' => Str::random(25),
        'amount' => $this->order->grand_total,
        'type' => OrderPayment::TYPE_ORDER_PAYMENT,
    ]);

    OrderStatusHistory::factory()->create([
        'order_status_id' => $this->order->order_status_id,
        'order_id' => $this->order->id,
        'user_id' => $this->order->user_id,
    ]);
    actingAs($user);
});

test('admin can refund partial amount of a charge', function () {
    Event::fake();
    postJson(route('v2.payments.refund', ['order' => $this->order]), [
        'notes' => $this->faker->sentence(),
        'amount' => '10.00',
        'add_to_wallet' => false,
    ])->assertStatus(Response::HTTP_CREATED);

    Event::assertDispatched(RefundSuccessful::class);
    expect($this->order->refunds()->count())->toEqual(1);
    expect($this->order->orderPayments()->count())->toEqual(2);
});

test('admin can not refund more than the charged amount', function () {
    postJson(route('v2.payments.refund', ['order' => $this->order]), [
        'notes' => $this->faker->sentence(),
        'amount' => $this->orderPayment->amount + 1,
        'add_to_wallet' => false,
    ])->assertStatus(Response::HTTP_UNPROCESSABLE_ENTITY);
});

test('admin can not refund a transaction with type refund', function () {
    postJson(route('v2.payments.refund', ['order' => $this->order]), [
        'notes' => $this->faker->sentence(),
        'amount' => $this->orderPayment->amount + 1,
        'add_to_wallet' => false,
    ])->assertStatus(Response::HTTP_UNPROCESSABLE_ENTITY);
});

// TODO: add more tests
test('admin can refund partial amount to a wallet', function () {
    Event::fake();
    postJson(route('v2.payments.refund', ['order' => $this->order]), [
        'notes' => $this->faker->sentence(),
        'amount' => '10.00',
        'add_to_wallet' => true,
    ])->assertStatus(Response::HTTP_CREATED);

    Event::assertDispatched(RefundSuccessful::class);
    Event::assertDispatched(TransactionHappened::class);

    expect($this->order->refunds()->count())->toEqual(1);
    expect($this->order->orderPayments()->count())->toEqual(2);
});

test('admin can refund full amount to a wallet', function () {
    Event::fake();
    postJson(route('v2.payments.refund', ['order' => $this->order]), [
        'notes' => $this->faker->sentence(),
        'amount' => $this->order->grand_total,
        'add_to_wallet' => true,
    ])->assertStatus(Response::HTTP_CREATED);

    Event::assertDispatched(RefundSuccessful::class);
    Event::assertDispatched(TransactionHappened::class);

    expect($this->order->refunds()->count())->toEqual(1);
    expect($this->order->orderPayments()->count())->toEqual(2);
});

test('admin can refund partial amount to a wallet when order has wallet payment', function () {
    Event::fake();
    $this->order->firstOrderPayment()->update([
        'amount' => $this->order->grand_total - 10.00,
    ]);
    OrderPayment::factory()->create([
        'order_id' => $this->order->id,
        'payment_method_id' => PaymentMethod::factory(),
        'response' => json_encode(['id' => Str::random(25)]),
        'payment_provider_reference_id' => Str::random(25),
        'amount' => 10.00,
        'type' => OrderPayment::TYPE_ORDER_PAYMENT,
    ]);
    postJson(route('v2.payments.refund', ['order' => $this->order]), [
        'notes' => $this->faker->sentence(),
        'amount' => 10.00,
        'add_to_wallet' => true,
    ])->assertStatus(Response::HTTP_CREATED);

    Event::assertDispatched(RefundSuccessful::class);
    Event::assertDispatched(TransactionHappened::class);

    expect($this->order->refunds()->count())->toEqual(1);
    expect($this->order->orderPayments()->count())->toEqual(3);
});

test('admin can refund full amount to a wallet when order has wallet payment', function () {
    Event::fake();
    $this->order->firstOrderPayment()->update([
        'amount' => $this->order->grand_total - 10.00,
    ]);

    OrderPayment::factory()->create([
        'order_id' => $this->order->id,
        'payment_method_id' => PaymentMethod::factory(),
        'response' => json_encode(['id' => Str::random(25)]),
        'payment_provider_reference_id' => Str::random(25),
        'amount' => 10.00,
        'type' => OrderPayment::TYPE_ORDER_PAYMENT,
    ]);

    postJson(route('v2.payments.refund', ['order' => $this->order]), [
        'notes' => $this->faker->sentence(),
        'amount' => $this->order->grand_total,
        'add_to_wallet' => true,
    ])->assertStatus(Response::HTTP_CREATED);

    Event::assertDispatched(RefundSuccessful::class);
    Event::assertDispatched(TransactionHappened::class);

    expect($this->order->refunds()->count())->toEqual(1);
    expect($this->order->orderPayments()->count())->toEqual(3);
});

test('admin can not refund full amount to payment method when order has wallet payment', function () {
    Event::fake();
    $this->order->firstOrderPayment()->update([
        'amount' => $this->order->grand_total - 10.00,
    ]);

    OrderPayment::factory()->create([
        'order_id' => $this->order->id,
        'payment_method_id' => PaymentMethod::factory(),
        'response' => json_encode(['id' => Str::random(25)]),
        'payment_provider_reference_id' => Str::random(25),
        'amount' => 10.00,
        'type' => OrderPayment::TYPE_ORDER_PAYMENT,
    ]);

    postJson(route('v2.payments.refund', ['order' => $this->order]), [
        'notes' => $this->faker->sentence(),
        'amount' => $this->order->grand_total,
        'add_to_wallet' => false,
    ])->assertUnprocessable();
});

test('admin can refund full charged amount to payment method when order has wallet payment', function () {
    Event::fake();
    $this->order->firstOrderPayment()->update([
        'amount' => $this->order->grand_total - 10.00,
    ]);

    OrderPayment::factory()->create([
        'order_id' => $this->order->id,
        'payment_method_id' => PaymentMethod::factory(),
        'response' => json_encode(['id' => Str::random(25)]),
        'payment_provider_reference_id' => Str::random(25),
        'amount' => 10.00,
        'type' => OrderPayment::TYPE_ORDER_PAYMENT,
    ]);

    postJson(route('v2.payments.refund', ['order' => $this->order]), [
        'notes' => $this->faker->sentence(),
        'amount' => $this->order->grand_total - 10,
        'add_to_wallet' => false,
    ])->assertStatus(Response::HTTP_CREATED);

    Event::assertDispatched(RefundSuccessful::class);

    expect($this->order->refunds()->count())->toEqual(1);
    expect($this->order->orderPayments()->count())->toEqual(3);
});
