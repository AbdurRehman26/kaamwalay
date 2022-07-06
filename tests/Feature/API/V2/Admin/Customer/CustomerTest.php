<?php

use App\Models\Order;
use App\Models\User;
use Database\Seeders\RolesSeeder;
use Database\Seeders\UsersSeeder;
use function Pest\Laravel\actingAs;
use function Pest\Laravel\getJson;

beforeEach(function () {
    $this->seed([
        RolesSeeder::class,
        UsersSeeder::class,
    ]);

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
                    'cards_count'
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
