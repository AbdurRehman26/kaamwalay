<?php

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
        'salesman_id' => User::factory()->withSalesman()
    ]);

    OrderPayment::factory()->for($this->order)->count(5);

    $this->actingAs($this->user);

});

it('adds commission to salesman when order is created', function () {

    $order = $this->order;
    SalesmanCommissionService::onOrderCreate($this->order);

    $commission = match ($order->salesman->salesmanProfile->commission_type->toString()) {
        'fixed' => $order->salesman->salesmanProfile->commission_value * $order->orderItems()->count(),
        default => $order->salesman->salesmanProfile->commission_value * ($order->grand_total - $order->refund_total + $order->extra_charge_total),
    };

    $earnedCommission = SalesmanEarnedCommission::where('salesman_id', $order->salesman_id)->first();

    $salesCommission = SalesmanCommission::whereId($this->order->user_id)->first();

    assertEquals($this->order->refresh()->salesman_commission, $commission);
    assertEquals($this->order->refresh()->salesman_commission, $earnedCommission->commission);
    assertEquals($this->order->refresh()->salesman_commission, $salesCommission->commission);

});

it('recalculates commission of salesman when order is refunded', function () {

    $order = $this->order;

    OrderPayment::factory()->create([
        'order_id' => $this->order->id,
        'payment_method_id' => $this->paymentMethod->id,
        'response' => json_encode(['id' => Str::random(25)]),
        'payment_provider_reference_id' => Str::random(25),
        'amount' => 10.00,
        'type' => OrderPayment::TYPE_REFUND,
        'created_at' => now()->addMinute(),
    ]);

    $this->order->salesman->salesmanProfile->commission_type = CommissionTypeEnum::PERCENTAGE;
    $this->order->salesman->salesmanProfile->save();

    SalesmanCommissionService::onOrderRefund($this->order);

    $commission = $order->salesman->salesmanProfile->commission_value *  ( $order->refunds()->latest()->first()->amount );

    $earnedCommission = SalesmanEarnedCommission::where('salesman_id', $order->salesman_id)->first();

    $salesCommission = SalesmanCommission::whereId($this->order->user_id)->first();

    assertEquals($this->order->refresh()->salesman_commission, -$commission);
    assertEquals($this->order->refresh()->salesman_commission, $earnedCommission->commission);
    assertEquals($this->order->refresh()->salesman_commission, $salesCommission->commission);

});
