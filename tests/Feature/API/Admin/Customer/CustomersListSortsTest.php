<?php

use App\Models\User;
use Database\Seeders\RolesSeeder;
use function Pest\Laravel\actingAs;
use function Pest\Laravel\getJson;

beforeEach(function () {
    $this->seed([
        RolesSeeder::class,
    ]);

    $this->user = User::factory()->withRole(config('permission.roles.admin'))->create();
    User::factory()->count(20)->withRole(config('permission.roles.customer'))->create();
    actingAs($this->user);
});

it('returns customers list order by asc email', function () {
    actingAs($this->user);
    $response = getJson(route('customers.index',  [
        'sort' => 'email',
    ]));

    $this->assertEquals(
        User::customer()->orderBy('email')->pluck('email')->toArray(),
        collect($response->getData()->data)->pluck('email')->toArray()
    );
});

it('returns customers list order by desc email', function () {
    $response = getJson(route('customers.index', [
        'sort' => '-email',
    ]))
        ->assertOk();

    $this->assertEquals(
        User::customer()->orderBy('email', 'DESC')->pluck('email')->toArray(),
        collect($response->getData()->data)->pluck('email')->toArray()
    );
});

it('returns customers list order by asc customer number', function () {
    $response = $this->getJson(route('customers.index', [
        'sort' => 'customer_number',
    ]))
        ->assertOk();

    $this->assertEquals(
        User::customer()->orderBy('customer_number')->pluck('customer_number')->toArray(),
        collect($response->getData()->data)->pluck('customer_number')->toArray()
    );
});

it('returns customers list order by desc customer_number', function () {
    $response = $this->getJson(route('customers.index', [
        'sort' => '-customer_number',
    ]))
        ->assertOk();

    $this->assertEquals(
        User::customer()->orderBy('customer_number', 'DESC')->pluck('customer_number')->toArray(),
        collect($response->getData()->data)->pluck('customer_number')->toArray()
    );
});

it('returns customers list order by asc full name', function () {
    $response = $this->getJson(route('customers.index', [
        'sort' => 'full_name',
    ]))->assertOk();

    $this->assertEquals(
        User::customer()->orderBy('first_name')->orderBy('last_name')->pluck('email')->toArray(),
        collect($response->getData()->data)->pluck('email')->toArray()
    );
});

it('returns customers list order by desc full name', function () {
    $response = $this->getJson(route('customers.index', [
        'sort' => '-full_name',
    ]))->assertOk();

    $this->assertEquals(
        User::customer()->orderBy('first_name', 'DESC')->orderBy('last_name', 'DESC')->pluck('email')->toArray(),
        collect($response->getData()->data)->pluck('email')->toArray()
    );
});

it('returns customers list order by asc signed up date', function () {
    $response = $this->getJson(route('customers.index', [
        'sort' => 'signed_up',
    ]))->assertOk();

    $this->assertEquals(
        User::customer()->orderBy('created_at')->pluck('email')->toArray(),
        collect($response->getData()->data)->pluck('email')->toArray()
    );
});

it('returns customers list order by desc signed up date', function () {
    $response = $this->getJson(route('customers.index', [
        'sort' => '-signed_up',
    ]))->assertOk();

    $this->assertEquals(
        User::customer()->orderBy('created_at', 'DESC')->pluck('email')->toArray(),
        collect($response->getData()->data)->pluck('email')->toArray()
    );
});
