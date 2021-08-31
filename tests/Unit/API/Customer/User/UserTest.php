<?php

use App\Models\User;
use Database\Seeders\RolesSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

uses(TestCase::class);
uses(RefreshDatabase::class);
uses(WithFaker::class);

beforeEach(function () {
    $this->seed(RolesSeeder::class);
});

test('customer can be created with role', function () {
    $user = User::createCustomer([
        'first_name' => $this->faker->firstName,
        'last_name' => $this->faker->lastName,
        'email' => $this->faker->safeEmail,
        'username' => $this->faker->userName,
        'password' => bcrypt('password'),
    ]);
    expect($user->hasRole(config('permission.roles.customer')))->toBeTrue();
});
