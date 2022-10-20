<?php

use App\Models\Order;
use App\Models\User;
use Database\Seeders\RolesSeeder;
use Database\Seeders\UsersSeeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Spatie\Permission\Models\Role;
use function Pest\Laravel\actingAs;
use function Pest\Laravel\getJson;
use function Pest\Laravel\postJson;
use Symfony\Component\HttpFoundation\Response;

beforeEach(function () {
    $this->seed([
        RolesSeeder::class,
    ]);

    $this->user = User::factory()->withRole(config('permission.roles.admin'))->create();
    $this->salesman = User::factory()->withRole(config('permission.roles.salesman'))->create();
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
                    'commission_paid',
                    'status',
                    'sales',
                ],
            ],
        ]);
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
        'role_ids' => DB::table('roles')->where('name', '=', config('permission.roles.salesman'))->pluck('id')
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
                'commission_paid',
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
    getJson(route('v2.salesmen.show', ['salesman' => $this->salesman]))
        ->assertOk()
        ->assertJsonStructure([
            'data' => [
                'profile_image',
                'full_name',
                'email',
                'customers',
                'orders',
                'commission_earned',
                'commission_paid',
                'status',
                'sales',
            ],
        ]);
});

test('a guest can not get single salesman details', function () {
    getJson(route('v2.salesmen.show', ['salesman' => $this->salesman]))
        ->assertStatus(Response::HTTP_UNAUTHORIZED);
});

test('a salesman can not get single salesman detail', function () {
    $user = User::factory()->withRole(config('permission.roles.customer'))->create();
    actingAs($user);
    getJson(route('v2.salesmen.show', ['salesman' => $this->salesman]))
        ->assertStatus(403);
});
