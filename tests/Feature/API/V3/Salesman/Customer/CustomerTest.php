<?php

use App\Models\User;
use Database\Seeders\RolesSeeder;
use Database\Seeders\UsersSeeder;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Foundation\Testing\WithFaker;
use function Pest\Laravel\actingAs;
use function Pest\Laravel\putJson;

uses(WithFaker::class);

beforeEach(function () {
    $this->seed([
        RolesSeeder::class,
        UsersSeeder::class,
    ]);

    $this->user = User::factory()->withRole(config('permission.roles.salesman'))->create();
    $this->customer = User::factory()->withRole(config('permission.roles.customer'))->state(new Sequence(
        ['salesman_id' => $this->user->id],
    ))->create();
});

test('sales rep can update customer details', function () {
    actingAs($this->user);
    Http::fake([
        '*' => Http::response([]),
    ]);

    putJson(route('v3.salesman.customer.update', $this->customer->id), [
        'first_name' => 'Lorem',
        'last_name' => 'Update',
        'phone' => '+1 (123) 456-7890',
    ])
        ->assertSuccessful();

    $customer = $this->customer->fresh();
    expect($customer->first_name)->toBe('Lorem')
        ->and($customer->last_name)->toBe('Update')
        ->and($customer->phone)->toBe('+1 (123) 456-7890');
});

test('sales rep can not update customer details if the user does not belong to them', function () {
    actingAs($this->user);
    Http::fake([
        '*' => Http::response([]),
    ]);
    $newCustomer = User::factory()->withRole(config('permission.roles.customer'))->create();

    putJson(route('v3.salesman.customer.update', $newCustomer->id), [
        'first_name' => 'Lorem',
        'last_name' => 'Update',
        'phone' => '+1 (123) 456-7890',
    ])
        ->assertForbidden();
});
