<?php

namespace Tests\Feature\API\Admin\Order;

use App\Events\API\Admin\Order\UnpaidOrderRefund;
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
use function Pest\Laravel\actingAs;
use function Pest\Laravel\postJson;
use function Pest\Laravel\seed;

uses(WithFaker::class);

/**
 * Scenarios to Test:
 * 1. Partial refund needs to be made to an unpaid order which has no extra charge or existing refunds.
 * 2. Partial refund needs to be made to an unpaid order which has extra charged and no existing refunds.
 * 3. Partial refund needs to be made to an unpaid order which has existing refund and no extra charge.
 * 4. Partial refund needs to be made to an unpaid order which has both existing refund and extra charge.
 * 5. Ensure that refund to wallet is not possible when order is unpaid.
 */

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

    Event::fake();
});

test(
    'Admin can refund partially to an unpaid order which has extra charge or existing refunds',
    function () {
        $oldGrandTotal = $this->order->grand_total;

        postJson(route('v2.payments.refund', ['order' => $this->order]), [
            'notes' => $this->faker->sentence(),
            'amount' => '10.00',
            'add_to_wallet' => false,
        ])->assertCreated();

        Event::assertDispatched(UnpaidOrderRefund::class);

        expect($this->order->refresh()->grand_total)->toEqual($oldGrandTotal - 10);

        expect($this->order->refunds()->count())->toEqual(1);
        expect($this->order->orderPayments()->count())->toEqual(2);
    }
);

test(
    'Admin can refund partially to an unpaid order which has no extra charge or existing refunds',
    function () {
        OrderPayment::factory()->create([
            'order_id' => $this->order->id,
            'payment_method_id' => 1,
            'response' => json_encode(['id' => Str::random(25)]),
            'payment_provider_reference_id' => Str::random(25),
            'amount' => 10,
            'type' => OrderPayment::TYPE_EXTRA_CHARGE,
        ]);

        $this->order->update([
            'extra_charge_total' => 10,
            'grand_total' => $this->order->grand_total + 10,
        ]);

        postJson(route('v2.payments.refund', ['order' => $this->order]), [
            'notes' => $this->faker->sentence(),
            'amount' => '10.00',
            'add_to_wallet' => false,
        ])->assertCreated();

        Event::assertDispatched(UnpaidOrderRefund::class);

        expect($this->order->refunds()->count())->toEqual(1);
        expect($this->order->orderPayments()->count())->toEqual(3);
    }
);

test(
    'Admin can refund partially to an unpaid order which has no extra charge but has existing refund',
    function () {
        OrderPayment::factory()->create([
            'order_id' => $this->order->id,
            'payment_method_id' => 1,
            'response' => json_encode(['id' => Str::random(25)]),
            'payment_provider_reference_id' => Str::random(25),
            'amount' => 10,
            'type' => OrderPayment::TYPE_REFUND,
        ]);

        $this->order->update([
            'refund_total' => 10,
            'grand_total' => $this->order->grand_total - 10,
        ]);

        postJson(route('v2.payments.refund', ['order' => $this->order]), [
            'notes' => $this->faker->sentence(),
            'amount' => '10.00',
            'add_to_wallet' => false,
        ])->assertCreated();

        Event::assertDispatched(UnpaidOrderRefund::class);
        expect($this->order->refunds()->count())->toEqual(2);
        expect($this->order->orderPayments()->count())->toEqual(3);
    }
);

test(
    'Admin can refund partially to an unpaid order which has both extra charge and existing refund',
    function () {
        OrderPayment::factory()->create([
            'order_id' => $this->order->id,
            'payment_method_id' => 1,
            'response' => json_encode(['id' => Str::random(25)]),
            'payment_provider_reference_id' => Str::random(25),
            'amount' => 10,
            'type' => OrderPayment::TYPE_REFUND,
        ]);
        OrderPayment::factory()->create([
            'order_id' => $this->order->id,
            'payment_method_id' => 1,
            'response' => json_encode(['id' => Str::random(25)]),
            'payment_provider_reference_id' => Str::random(25),
            'amount' => 20,
            'type' => OrderPayment::TYPE_EXTRA_CHARGE,
        ]);

        $this->order->update([
            'refund_total' => 10,
            'extra_charge_total' => 20,
            'grand_total' => $this->order->grand_total - 10 + 20,
        ]);

        postJson(route('v2.payments.refund', ['order' => $this->order]), [
            'notes' => $this->faker->sentence(),
            'amount' => '10.00',
            'add_to_wallet' => false,
        ])->assertCreated();

        Event::assertDispatched(UnpaidOrderRefund::class);
        expect($this->order->refunds()->count())->toEqual(2);
        expect($this->order->orderPayments()->count())->toEqual(4);
    }
);

test('Admin can not refund to wallet when order is unpaid', function () {
    postJson(route('v2.payments.refund', ['order' => $this->order]), [
        'notes' => $this->faker->sentence(),
        'amount' => $this->order->grand_total,
        'add_to_wallet' => true,
    ])->assertUnprocessable();
});
