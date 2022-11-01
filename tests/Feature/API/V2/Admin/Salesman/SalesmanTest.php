<?php

use App\Enums\Salesman\CommissionTypeEnum;
use App\Models\Order;
use App\Models\User;
use Database\Seeders\RolesSeeder;
use function Pest\Laravel\actingAs;
use function Pest\Laravel\getJson;
use function Pest\Laravel\postJson;
use Symfony\Component\HttpFoundation\Response;

beforeEach(function () {
    $this->seed([
        RolesSeeder::class,
    ]);
    Bus::fake();

    $this->user = User::factory()->withRole(config('permission.roles.admin'))->create();
    $this->salesmen = User::factory()->count(15)->withSalesmanRole()->create();

    $users = $this->users = User::factory()->count(15)->withRole(config('permission.roles.customer'))->create([
        'salesman_id' => $this->salesmen->random()->id
    ]);

    $orders = Order::factory()->count(15)->create();

    $orders->map(function(Order $order) use ($users){
        $user = $users->random();
        $order->salesman_id = $user->salesman_id;
        $order->user_id = $user->id;
        $order->save();
    });

});

it('returns salesmen list for admin', function () {
    actingAs($this->user);
    getJson(route('v2.salesmen.index'))
        ->assertOk()
        ->assertJsonStructure([
            'data' => [
                [
                    'profile_image',
                    'full_name',
                    'email',
                    'customers',
                    'orders',
                    'commission_earned',
                    'status',
                    'sales',
                ],
            ],
        ]);
});

it('returns salesmen list by status filter for admin', function () {
    actingAs($this->user);

    $this->salesmen->map(function (User $user) {
        $user->salesmanProfile->is_active = 0;
        $user->salesmanProfile->save();
    });

    $this->salesmen->first()->salesmanProfile->is_active = 1;
    $this->salesmen->first()->salesmanProfile->save();

    getJson(route('v2.salesmen.index', [
        'filter[is_active]' => true,
    ]))
        ->assertOk()
        ->assertJsonCount(1, ['data'])
        ->assertJsonStructure([
            'data' => [
                [
                    'profile_image',
                    'full_name',
                    'email',
                    'customers',
                    'orders',
                    'commission_earned',
                    'status',
                    'sales',
                ],
            ],
        ]);
});

it('returns salesmen list by sales sort for admin', function () {
    actingAs($this->user);

    $response = getJson(route('v2.salesmen.index', [
        'sort' => '-sales',
    ]))
        ->assertOk()
        ->assertJsonStructure([
            'data' => [
                [
                    'profile_image',
                    'full_name',
                    'email',
                    'customers',
                    'orders',
                    'commission_earned',
                    'status',
                    'sales',
                ],
            ],
        ]);

    $this->assertEquals(
        User::salesmen()->withSum('orders', 'grand_total')->orderBy('orders_sum_grand_total', 'DESC')->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );

});

test('a guest can not get salesmen list', function () {
    getJson(route('v2.salesmen.index'))
        ->assertStatus(401);
});

test('a customer can not get salesmen list', function () {
    $user = User::factory()->withRole(config('permission.roles.customer'))->create();
    actingAs($user);
    getJson(route('v2.salesmen.index'))
        ->assertStatus(403);
});

test('an admin can create a salesman', function () {
    actingAs($this->user);
    postJson(route('v2.salesmen.store'), [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'email' => 'luis@wooter.com',
        'phone' => '+1234567890',
        'commission_type' => CommissionTypeEnum::FIXED,
        'commission_value' => 2,
        'is_active' => true,
    ])
        ->assertSuccessful()
        ->assertJsonStructure([
            'data' => [
                'id',
                'profile_image',
                'full_name',
                'email',
                'customers',
                'orders',
                'commission_earned',
                'status',
                'sales',
            ],
        ]);
});

test('a customer cannot create salesmen', function () {
    $user = User::factory()->withRole(config('permission.roles.customer'))->create();
    actingAs($user);

    postJson(route('v2.salesmen.store'), [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'email' => 'luis@wooter.com',
        'phone' => '+1234567890',
    ])
    ->assertStatus(403);
});

test('a guest cannot create salesmen', function () {
    postJson(route('v2.salesmen.store'), [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'email' => 'luis@wooter.com',
        'phone' => '+1234567890',
    ])
        ->assertStatus(401);
});

it('returns single salesman details for admin', function () {
    actingAs($this->user);
    getJson(route('v2.salesmen.show', ['salesman' => $this->salesmen->first()]))
        ->assertOk()
        ->assertJsonStructure([
            'data' => [
                'profile_image',
                'full_name',
                'email',
                'customers',
                'orders',
                'commission_earned',
                'status',
                'sales',
            ],
        ]);
});

test('a guest can not get single salesman details', function () {
    getJson(route('v2.salesmen.show', ['salesman' => $this->salesmen->first()]))
        ->assertStatus(Response::HTTP_UNAUTHORIZED);
});

test('a salesman can not get single salesman detail', function () {
    $user = User::factory()->withRole(config('permission.roles.customer'))->create();
    actingAs($user);
    getJson(route('v2.salesmen.show', ['salesman' => $this->salesmen->first()]))
        ->assertStatus(403);
});
