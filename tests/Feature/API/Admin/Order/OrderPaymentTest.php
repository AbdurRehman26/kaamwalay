<?php

namespace Tests\Feature\API\Admin\Order;

use App\Events\API\Admin\Order\ExtraChargeSuccessful;
use App\Models\Order;
use App\Models\OrderPayment;
use App\Models\OrderStatus;
use App\Models\OrderStatusHistory;
use App\Models\User;
use Database\Seeders\CardCategoriesSeeder;
use Database\Seeders\CardProductSeeder;
use Database\Seeders\CardSeriesSeeder;
use Database\Seeders\CardSetsSeeder;
use Database\Seeders\RolesSeeder;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Config;
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

    OrderPayment::factory()->create([
        'order_id' => $this->order->id,
        'payment_method_id' => 1,
        'payment_provider_reference_id' => Str::random(25),
    ]);

    OrderStatusHistory::factory()->create([
        'order_status_id' => $this->order->order_status_id,
        'order_id' => $this->order->id,
        'user_id' => $this->order->user_id,
    ]);
    $this->actingAs($user);
});

test('admin can create extra charge for order', function () {
    Config::set('robograding.extra_charge_enabled', true);
    Event::fake();
    $this->postJson('/api/admin/orders/' . $this->order->id . '/payments/extra-charge', [
        'notes' => $this->faker->sentence(),
        'amount' => '20.00',
    ])->assertStatus(Response::HTTP_CREATED);

    Event::assertDispatched(ExtraChargeSuccessful::class);
    expect($this->order->extraCharges()->count())->toEqual(1);
    expect($this->order->orderPayments()->count())->toEqual(2);
});

test('admin can update order payment notes', function () {
    $orderPayment = OrderPayment::factory()->create([
        'order_id' => $this->order->id,
    ]);
    $notes = $this->faker->sentence();
    $this->putJson('/api/admin/orders/' . $this->order->id . '/order-payments/' . $orderPayment->id, [
        'notes' => $notes,
    ])
        ->assertStatus(Response::HTTP_OK);
    $orderPayment->refresh();
    expect($orderPayment->notes)->toEqual($notes);
});

it('does not perform extra charge when service is disabled', function () {
    Config::set('robograding.extra_charge_enabled', false);
    $this->postJson('/api/admin/orders/' . $this->order->id . '/payments/extra-charge', [
        'notes' => $this->faker->sentence(),
        'amount' => '20.00',
    ])->assertStatus(Response::HTTP_SERVICE_UNAVAILABLE);
});
