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

    $this->user = User::factory()->withRole(config('permission.roles.admin'))->create();
    $this->customer = User::factory()->withRole(config('permission.roles.customer'))->create();
    Order::factory()->for($this->customer)->count(10)->create();
});

it('returns customers list for admin', function () {
    actingAs($this->user);
    getJson(route('v2.customers.index'))
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
    getJson(route('v2.customers.index'))
        ->assertStatus(401);
});

test('a customer can not get customers list', function () {
    $user = User::factory()->withRole(config('permission.roles.customer'))->create();
    actingAs($user);
    getJson(route('v2.customers.index'))
        ->assertStatus(403);
});

it('can create a customer', function () {
    actingAs($this->user);

    postJson(route('v2.customers.store'), [
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

    postJson(route('v2.customers.store'), [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'email' => 'luis@wooter.com',
        'phone' => '+1234567890',
    ])
    ->assertStatus(403);
});

test('a guest cannot create customers', function () {
    postJson(route('v2.customers.store'), [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'email' => 'luis@wooter.com',
        'phone' => '+1234567890',
    ])
        ->assertStatus(401);
});

it('can resend user access email', function () {
    actingAs($this->user);

    $user = User::factory()->create(['last_login_at' => null]);

    postJson(route('v2.customers.send-access-email', $user))
        ->assertSuccessful()
        ->assertJsonStructure([
            'success',
            'message',
        ]);
});

it('cannot resend user access email to user who already has logged in', function () {
    actingAs($this->user);

    $user = User::factory()->create();

    postJson(route('v2.customers.send-access-email', $user))
        ->assertStatus(422);
});

test('a customer can not resend user access email', function () {
    $user = User::factory()->withRole(config('permission.roles.customer'))->create();
    actingAs($user);

    $newUser = User::factory()->create(['last_login_at' => null]);

    postJson(route('v2.customers.send-access-email', $newUser))
        ->assertStatus(403);
});

test('a guest can not resend user access email', function () {
    $user = User::factory()->create(['last_login_at' => null]);

    postJson(route('v2.customers.send-access-email', $user))
        ->assertStatus(401);
});

it('returns single customer details for admin', function () {
    actingAs($this->user);
    getJson(route('v2.customers.show', ['customer' => $this->customer]))
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
    getJson(route('v2.customers.show', ['customer' => $this->customer]))
        ->assertStatus(Response::HTTP_UNAUTHORIZED);
});

test('a customer can not get single customer detail', function () {
    $user = User::factory()->withRole(config('permission.roles.customer'))->create();
    actingAs($user);
    getJson(route('v2.customers.show', ['customer' => $this->customer]))
        ->assertStatus(403);
});

it('can assign a salesman to customer', function () {
    actingAs($this->user);

    $salesman = User::factory()
        ->withRole(config('permission.roles.salesman'))
        ->create();

    $customer = User::factory()
        ->withRole(config('permission.roles.customer'))
        ->create();

    postJson(route('v2.customers.assign-salesman', [
            'salesman' => $salesman,
            'user' => $customer,
        ]))
        ->assertSuccessful();
});

it('can unassign a salesman from customer', function () {
    actingAs($this->user);

    $salesman = User::factory()
        ->withRole(config('permission.roles.salesman'))
        ->create();

    $customer = User::factory()
        ->withRole(config('permission.roles.customer'))
        ->create([
            'salesman_id' => $salesman->id,
        ]);

    postJson(route('v2.customers.unassign-salesman', [
        'user' => $customer,
    ]))->assertSuccessful();

    expect($customer->refresh()->salesman)->toBe(null);
});

it('a guest cannot assign a salesman to customer', function () {
    $salesman = User::factory()
        ->withRole(config('permission.roles.salesman'))
        ->create();

    $customer = User::factory()
        ->withRole(config('permission.roles.customer'))
        ->create();

    postJson(route('v2.customers.assign-salesman', [
        'salesman' => $salesman,
        'user' => $customer,
    ]))->assertUnauthorized();
});

it('a customer cannot assign a salesman to customer', function () {
    $salesman = User::factory()
        ->withRole(config('permission.roles.salesman'))
        ->create();

    $customer = User::factory()
        ->withRole(config('permission.roles.customer'))
        ->create();

    actingAs($customer);

    postJson(route('v2.customers.assign-salesman', [
        'salesman' => $salesman,
        'user' => $customer,
    ]))->assertForbidden();
});

test('user with customer role cannot be assigned as a salesman to customer', function () {
    actingAs($this->user);

    $customer1 = User::factory()
        ->withRole(config('permission.roles.customer'))
        ->create();

    $customer = User::factory()
        ->withRole(config('permission.roles.customer'))
        ->create();

    postJson(route('v2.customers.assign-salesman', [
        'salesman' => $customer1,
        'user' => $customer,
    ]))->assertUnprocessable();
});
