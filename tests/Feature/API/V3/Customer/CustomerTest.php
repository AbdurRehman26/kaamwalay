<?php

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

    $this->customer = User::factory()->withRole(config('permission.roles.customer'))->create();
    $this->customers = User::factory()->withRole(config('permission.roles.customer'))->count(3)->create();

    actingAs($this->customer);
});

test('a customer can search for other customer based on exact email address', function () {
    $customer = $this->customers->random();

    getJson(route('v3.customer.index', [
        'filter' => ['search' => $customer->email],
    ]))
        ->assertSuccessful()
        ->assertJsonStructure([
            'data' => [
                [
                    'id',
                    'email',
                    'first_name',
                    'last_name',
                    'customer_number',
                    'profile_image',
                ],
            ],
        ])
        ->assertJsonFragment([
            'data' => [
                [
                    'id' => $customer->id,
                    'customer_number' => $customer->customer_number,
                    'email' => maskEmail($customer->email),
                    'first_name' => $customer->first_name,
                    'last_name' => $customer->last_name,
                    'profile_image' => $customer->profile_image,
                ],
            ],
        ]);
});

test('a customer can search for other customer based on exact customer number', function () {
    $customer = $this->customers->random();

    getJson(route('v3.customer.index', [
        'filter' => ['search' => $customer->customer_number],
    ]))
        ->assertSuccessful()
        ->assertJsonStructure([
            'data' => [
                [
                    'id',
                    'email',
                    'first_name',
                    'last_name',
                    'customer_number',
                    'profile_image',
                ],
            ],
        ])
        ->assertJsonFragment([
            'data' => [
                [
                    'id' => $customer->id,
                    'customer_number' => $customer->customer_number,
                    'email' => maskEmail($customer->email),
                    'first_name' => $customer->first_name,
                    'last_name' => $customer->last_name,
                    'profile_image' => $customer->profile_image,
                ],
            ],
        ]);
});

test('a customer cannot search for other customer based on partial or wrong email address', function () {
    $customer = $this->customers->random();

    getJson(route('v3.customer.index', [
        'filter' => ['search' => Str::substr($customer->email, 0, 5)],
    ]))->assertJsonCount(0, 'data');
});

test('customer list can not be called without filter[search] param', function () {
    getJson(route('v3.customer.index'))->assertUnprocessable();
});
