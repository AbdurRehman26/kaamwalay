<?php

use App\Models\Order;
use App\Models\User;
use Database\Seeders\RolesSeeder;
use Database\Seeders\UsersSeeder;
use function Pest\Laravel\actingAs;
use function Pest\Laravel\getJson;
use function Pest\Laravel\postJson;
use Symfony\Component\HttpFoundation\Response;

beforeEach(function () {
    $this->seed([
        RolesSeeder::class,
        UsersSeeder::class,
    ]);
    Bus::fake();

    $this->user = User::factory()->withSalesmanRole()->create();
    $this->customer = User::factory()->withRole(config('permission.roles.customer'))->create([
        'salesman_id' => $this->user->id,
    ]);
    Order::factory()->for($this->customer)->count(10)->create([
        'salesman_id' => $this->user->id,
    ]);
});

it('returns customers list for salesman', function () {
    actingAs($this->user);
    getJson(route('v2.salesman.customers.index'))
        ->assertOk()
        ->assertJsonStructure([
            'data' => [
                [
                    'profile_image',
                    'full_name',
                    'customer_number',
                    'email',
                    'phone',
                    'created_at',
                    'submissions',
                    'cards_count',
                ],
            ],
        ]);
});

test('a guest can not get customers list', function () {
    getJson(route('v2.salesman.customers.index'))
        ->assertStatus(401);
});

test('a customer can not get customers list', function () {
    $user = User::factory()->withRole(config('permission.roles.customer'))->create();
    actingAs($user);
    getJson(route('v2.salesman.customers.index'))
        ->assertStatus(403);
});

it('can create a customer', function () {
    actingAs($this->user);

    postJson(route('v2.salesman.customers.store'), [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'email' => 'luis@wooter.com',
        'phone' => '+1234567890',
    ])
        ->assertSuccessful()
        ->assertJsonStructure([
            'data' => [
                'id',
                'profile_image',
                'full_name',
                'customer_number',
                'email',
                'phone',
                'submissions',
                'cards_count',
                'wallet',
                'last_login_at',
            ],
        ]);
});

test('a customer cannot create customers', function () {
    $user = User::factory()->withRole(config('permission.roles.customer'))->create();
    actingAs($user);

    postJson(route('v2.salesman.customers.store'), [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'email' => 'luis@wooter.com',
        'phone' => '+1234567890',
    ])
    ->assertStatus(403);
});

test('a guest cannot create customers', function () {
    postJson(route('v2.salesman.customers.store'), [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'email' => 'luis@wooter.com',
        'phone' => '+1234567890',
    ])
        ->assertStatus(401);
});

it('returns single customer details for salesman', function () {
    actingAs($this->user);
    getJson(route('v2.salesman.customers.show', ['customer' => $this->customer]))
        ->assertOk()
        ->assertJsonStructure([
            'data' => [
                'profile_image',
                'full_name',
                'customer_number',
                'submissions',
                'email',
                'phone',
                'created_at',
                'submissions',
                'cards_count',
            ],
        ]);
});

test('a guest can not get single customer details', function () {
    getJson(route('v2.salesman.customers.show', ['customer' => $this->customer]))
        ->assertStatus(Response::HTTP_UNAUTHORIZED);
});

test('a customer can not get single customer detail', function () {
    $user = User::factory()->withRole(config('permission.roles.customer'))->create();
    actingAs($user);
    getJson(route('v2.salesman.customers.show', ['customer' => $this->customer]))
        ->assertStatus(403);
});
