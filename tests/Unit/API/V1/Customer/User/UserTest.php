<?php

use App\Models\User;
use App\Services\SerialNumberService\SerialNumberService;
use Database\Seeders\RolesSeeder;
use Illuminate\Foundation\Testing\WithFaker;

uses(WithFaker::class);

beforeEach(function () {
    $this->seed(RolesSeeder::class);
});

test('customer can be created with role', function () {
    $user = User::createCustomer([
        'first_name' => $this->faker->firstName(),
        'last_name' => $this->faker->lastName(),
        'email' => $this->faker->safeEmail(),
        'username' => $this->faker->userName(),
        'password' => bcrypt('password'),
    ]);
    expect($user->hasRole(config('permission.roles.customer')))->toBeTrue();
});

test('customer should have customer_number on create', function () {
    $user = User::createCustomer([
        'first_name' => $this->faker->firstName(),
        'last_name' => $this->faker->lastName(),
        'email' => $this->faker->safeEmail(),
        'username' => $this->faker->userName(),
        'password' => bcrypt('password'),
    ]);

    expect($user->customer_number)->not->toBeEmpty();
    expect($user->customer_number)->toEndWith($user->id);
    expect($user->customer_number)->toEqual(SerialNumberService::customer($user->id));
});