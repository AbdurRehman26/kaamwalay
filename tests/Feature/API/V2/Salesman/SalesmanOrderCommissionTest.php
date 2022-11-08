<?php

use App\Enums\Salesman\CommissionEarnedEnum;
use App\Enums\Salesman\CommissionTypeEnum;
use App\Models\Order;
use App\Models\OrderPayment;
use App\Models\OrderStatus;
use App\Models\PaymentMethod;
use App\Models\SalesmanCommission;
use App\Models\SalesmanEarnedCommission;
use App\Models\User;
use App\Services\SalesmanCommission\SalesmanCommissionService;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;

use function PHPUnit\Framework\assertEquals;

beforeEach(function () {
    Event::fake();
    Bus::fake();

    $this->user = User::factory()->withRole(config('permission.roles.customer'))->create([]);

    $this->paymentMethod = PaymentMethod::factory()->create([
        'code' => 'stripe',
    ]);

    $this->order = Order::factory()->create([
        'user_id' => $this->user->id,
        'coupon_id' => null,
        'payment_method_id' => $this->paymentMethod->id,
        'order_status_id' => OrderStatus::PLACED,
        'salesman_id' => User::factory()->withSalesmanRole(),
    ]);

    OrderPayment::factory()->for($this->order)->count(5);

    $this->actingAs($this->user);
});

it('salesman commissions on different order lines', function ($orderLine) {
    $order = $this->order;
    SalesmanCommissionService::onOrderLine($this->order, $orderLine['commission_type']);

    $commission = $orderLine['commission'];

    $earnedCommission = SalesmanEarnedCommission::where('salesman_id', $order->salesman_id)->first();

    $salesCommission = SalesmanCommission::where('salesman_id', $this->order->salesman_id)->first();

    assertEquals($this->order->refresh()->salesman_commission, $commission);
    assertEquals($this->order->refresh()->salesman_commission, $earnedCommission->commission);
    assertEquals($this->order->refresh()->salesman_commission, $salesCommission->commission);
})->with('orderLine');

dataset('orderLine', function () {
    yield function () {
        $order = $this->order;

        $commission = match ($order->salesman->salesmanProfile->commission_type->toString()) {
            'fixed' => $order->salesman->salesmanProfile->commission_value * $order->orderItems()->count(),
            default => $order->salesman->salesmanProfile->commission_value % ($order->grand_total - $order->refund_total + $order->extra_charge_total),
        };

        return [
            'commission_type' => CommissionEarnedEnum::ORDER_CREATED,
            'commission' => $commission,
        ];
    };

    yield function () {
        $order = $this->order;

        $order->salesman->salesmanProfile->commission_type = CommissionTypeEnum::PERCENTAGE;
        $order->salesman->salesmanProfile->save();

        OrderPayment::factory()->create([
            'order_id' => $order->id,
            'payment_method_id' => $this->paymentMethod->id,
            'response' => json_encode(['id' => Str::random(25)]),
            'payment_provider_reference_id' => Str::random(25),
            'amount' => 10.00,
            'type' => OrderPayment::TYPE_REFUND,
            'created_at' => now()->addMinute(),
        ]);

        $commission = -($order->salesman->salesmanProfile->commission_value % ($order->refunds()->latest()->first()->amount));

        return [
            'commission_type' => CommissionEarnedEnum::ORDER_REFUNDED,
            'commission' => $commission,
        ];
    };

    yield function () {
        $order = $this->order;

        $order->salesman->salesmanProfile->commission_type = CommissionTypeEnum::PERCENTAGE;
        $order->salesman->salesmanProfile->save();

        OrderPayment::factory()->create([
            'order_id' => $order->id,
            'payment_method_id' => $this->paymentMethod->id,
            'response' => json_encode(['id' => Str::random(25)]),
            'payment_provider_reference_id' => Str::random(25),
            'amount' => 10.00,
            'type' => OrderPayment::TYPE_EXTRA_CHARGE,
            'created_at' => now()->addMinute(),
        ]);

        $commission = ($order->salesman->salesmanProfile->commission_value % ($order->extraCharges()->latest()->first()->amount));

        return [
            'commission_type' => CommissionEarnedEnum::ORDER_EXTRA_CHARGE,
            'commission' => $commission,
        ];
    };
});
