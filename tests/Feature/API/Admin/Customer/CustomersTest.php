<?php

use App\Models\User;
use Database\Seeders\OrderSeeder;
use Database\Seeders\RolesSeeder;
use Database\Seeders\UsersSeeder;
use function Pest\Laravel\actingAs;
use function Pest\Laravel\getJson;

beforeEach(function () {
    $this->seed([
        RolesSeeder::class,
        UsersSeeder::class,
        OrderSeeder::class,
    ]);

    $this->user = User::factory()->withRole(config('permission.roles.admin'))->create();
});

it('returns customers list for admin', function () {
    actingAs($this->user);
    getJson(route('customers.index'))
        ->assertOk()
        ->assertJsonStructure([
            'data' => [
                [
                    'profile_image',
                    'full_name',
                    'customer_number',
                    'email',
                    'phone',
                    'signed_up',
                    'submissions',
                ],
            ],
        ]);
});

it('does not return customers list for guest', function () {
    getJson(route('customers.index'))
        ->assertStatus(401);
});

it('does not return customers list for customer', function () {
    $user = User::factory()->withRole(config('permission.roles.customer'))->create();
    actingAs($user);
    getJson(route('customers.index'))
        ->assertStatus(403);
});
