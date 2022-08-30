<?php


use App\Enums\Order\OrderPaymentStatusEnum;
use App\Models\Order;
use App\Models\OrderStatus;
use App\Models\OrderStatusHistory;
use App\Models\User;
use Database\Seeders\CardCategoriesSeeder;
use Database\Seeders\CardProductSeeder;
use Database\Seeders\CardSeriesSeeder;
use Database\Seeders\CardSetsSeeder;
use Database\Seeders\RolesSeeder;
use Illuminate\Foundation\Testing\WithFaker;

use function Pest\Laravel\postJson;

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
        'payment_method_id' => null, // intentionally null, because a new order do not have the payment method ID
    ]);

    OrderStatusHistory::factory()->create([
        'order_status_id' => $this->order->order_status_id,
        'order_id' => $this->order->id,
        'user_id' => $this->order->user_id,
    ]);
    $this->actingAs($user);
});

test('admin can mark order as paid', function () {
    Event::fake();
    postJson(route('v2.admin.orders.mark-paid', ['order' => $this->order]))->assertSuccessful();

    expect($this->order->refresh())->payment_status->toBe(OrderPaymentStatusEnum::PAID);
});

test('customer can not mark order as paid', function () {
    Event::fake();
    $this->actingAs(User::factory()->withRole(config('permission.roles.customer'))->create());
    postJson(route('v2.admin.orders.mark-paid', ['order' => $this->order]))->assertForbidden();
});

test('admin can mark order paid for only unpaid orders', function () {
    Event::fake();
    $this->order->update([
        'payment_status' => OrderPaymentStatusEnum::PAID,
    ]);
    postJson(route('v2.admin.orders.mark-paid', ['order' => $this->order]))->assertUnprocessable();
});
