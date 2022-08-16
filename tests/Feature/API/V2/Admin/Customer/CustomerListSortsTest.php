<?php

use App\Enums\Order\OrderPaymentStatusEnum;
use App\Models\User;
use Database\Seeders\RolesSeeder;
use Illuminate\Database\Eloquent\Builder;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\getJson;

beforeEach(function () {
    $this->seed([
        RolesSeeder::class,
    ]);

    $this->user = User::factory()->withRole(config('permission.roles.admin'))->create();
    User::factory()->count(20)->withRole(config('permission.roles.customer'))->create();
    actingAs($this->user);
});

it('returns customers list order by asc email', function () {
    actingAs($this->user);
    $response = getJson(route('v2.customers.index',  [
        'sort' => 'email',
    ]));

    $this->assertEquals(
        User::customer()->orderBy('email')->pluck('email')->toArray(),
        collect($response->getData()->data)->pluck('email')->toArray()
    );
});

it('returns customers list order by desc email', function () {
    $response = getJson(route('v2.customers.index', [
        'sort' => '-email',
    ]))
        ->assertOk();

    $this->assertEquals(
        User::customer()->orderBy('email', 'DESC')->pluck('email')->toArray(),
        collect($response->getData()->data)->pluck('email')->toArray()
    );
});

it('returns customers list order by asc customer number', function () {
    $response = $this->getJson(route('v2.customers.index', [
        'sort' => 'customer_number',
    ]))
        ->assertOk();

    $this->assertEquals(
        User::customer()->orderBy('customer_number')->pluck('customer_number')->toArray(),
        collect($response->getData()->data)->pluck('customer_number')->toArray()
    );
});

it('returns customers list order by desc customer_number', function () {
    $response = $this->getJson(route('v2.customers.index', [
        'sort' => '-customer_number',
    ]))
        ->assertOk();

    $this->assertEquals(
        User::customer()->orderBy('customer_number', 'DESC')->pluck('customer_number')->toArray(),
        collect($response->getData()->data)->pluck('customer_number')->toArray()
    );
});

it('returns customers list order by asc full name', function () {
    $response = $this->getJson(route('v2.customers.index', [
        'sort' => 'full_name',
    ]))->assertOk();

    $this->assertEquals(
        User::customer()->orderBy('first_name')->orderBy('last_name')->pluck('email')->toArray(),
        collect($response->getData()->data)->pluck('email')->toArray()
    );
});

it('returns customers list order by desc full name', function () {
    $response = $this->getJson(route('v2.customers.index', [
        'sort' => '-full_name',
    ]))->assertOk();

    $this->assertEquals(
        User::customer()->orderBy('first_name', 'DESC')->orderBy('last_name', 'DESC')->pluck('email')->toArray(),
        collect($response->getData()->data)->pluck('email')->toArray()
    );
});

it('returns customers list order by asc signed up date', function () {
    $response = $this->getJson(route('v2.customers.index', [
        'sort' => 'created_at',
    ]))->assertOk();

    $this->assertEquals(
        User::customer()->orderBy('created_at')->pluck('email')->toArray(),
        collect($response->getData()->data)->pluck('email')->toArray()
    );
});

it('returns customers list order by desc signed up date', function () {
    $response = $this->getJson(route('v2.customers.index', [
        'sort' => '-created_at',
    ]))->assertOk();

    $this->assertEquals(
        User::customer()->orderBy('created_at', 'DESC')->pluck('email')->toArray(),
        collect($response->getData()->data)->pluck('email')->toArray()
    );
});

it('returns customers list order by asc phone', function () {
    $response = $this->getJson(route('v2.customers.index', [
        'sort' => 'phone',
    ]))->assertOk();

    $this->assertEquals(
        User::customer()->orderBy('phone')->pluck('email')->toArray(),
        collect($response->getData()->data)->pluck('email')->toArray()
    );
});

it('returns customers list order by desc phone', function () {
    $response = $this->getJson(route('v2.customers.index', [
        'sort' => '-phone',
    ]))->assertOk();

    $this->assertEquals(
        User::customer()->orderBy('phone', 'DESC')->pluck('email')->toArray(),
        collect($response->getData()->data)->pluck('email')->toArray()
    );
});

it('returns customers list order by asc submissions number', function () {
    $response = $this->getJson(route('v2.customers.index', [
        'sort' => 'submissions',
    ]))->assertOk();

    $this->assertEquals(
        User::customer()->withCount(['orders' => function (Builder $q) {
            $q->where('payment_status', OrderPaymentStatusEnum::PAID);
        }])->orderBy('orders_count', 'ASC')->pluck('email')->toArray(),
        collect($response->getData()->data)->pluck('email')->toArray()
    );
});

it('returns customers list order by desc submissions number', function () {
    $response = $this->getJson(route('v2.customers.index', [
        'sort' => '-submissions',
    ]))->assertOk();

    $this->assertEquals(
        User::customer()->withCount(['orders' => function (Builder $q) {
            $q->where('payment_status', OrderPaymentStatusEnum::PAID);
        }])->orderBy('orders_count', 'DESC')->pluck('email')->toArray(),
        collect($response->getData()->data)->pluck('email')->toArray()
    );
});

it('returns customers list order by asc cards number', function () {
    $response = $this->getJson(route('v2.customers.index', [
        'sort' => 'cards',
    ]))->assertOk();

    $this->assertEquals(
        User::customer()->withSum(['orderItems' => function (Builder $q) {
            $q->where('orders.payment_status', OrderPaymentStatusEnum::PAID);
        }], 'quantity')->orderBy('order_items_sum_quantity', 'ASC')->pluck('email')->toArray(),
        collect($response->getData()->data)->pluck('email')->toArray()
    );
});

it('returns customers list order by desc cards number', function () {
    $response = $this->getJson(route('v2.customers.index', [
        'sort' => '-cards',
    ]))->assertOk();

    $this->assertEquals(
        User::customer()->withSum(['orderItems' => function (Builder $q) {
            $q->where('orders.payment_status', OrderPaymentStatusEnum::PAID);
        }], 'quantity')->orderBy('order_items_sum_quantity', 'DESC')->pluck('email')->toArray(),
        collect($response->getData()->data)->pluck('email')->toArray()
    );
});

it('returns customers list order by asc wallet balance', function () {
    $response = $this->getJson(route('v2.customers.index', [
        'sort' => 'wallet',
    ]))->assertOk();

    $this->assertEquals(
        User::customer()->withSum('wallet', 'balance')->orderBy('wallet_sum_balance', 'ASC')->pluck('email')->toArray(),
        collect($response->getData()->data)->pluck('email')->toArray()
    );
});

it('returns customers list order by desc wallet balance', function () {
    $response = $this->getJson(route('v2.customers.index', [
        'sort' => '-wallet',
    ]))->assertOk();

    $this->assertEquals(
        User::customer()->withSum('wallet', 'balance')->orderBy('wallet_sum_balance', 'DESC')->pluck('email')->toArray(),
        collect($response->getData()->data)->pluck('email')->toArray()
    );
});
