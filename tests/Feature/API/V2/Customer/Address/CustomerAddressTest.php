<?php

use App\Models\CustomerAddress;

use Illuminate\Foundation\Testing\WithFaker;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\postJson;

uses(WithFaker::class);

beforeEach(function () {
    $this->addresses = CustomerAddress::factory()->count(2)->create();
    actingAs($this->addresses->first()->user);
});

test('user can receive addresses', function () {
    $response = $this->getJson('/api/v2/customer/addresses');
    $response->assertJsonStructure([
        'data' => [['id', 'first_name', 'last_name', 'state']],
    ]);
});

test('user can receive single address', function () {
    $response = $this->getJson('/api/v2/customer/addresses/' . $this->addresses[0]->id);
    $response->assertJsonStructure([
        'data' => ['id', 'first_name', 'last_name', 'state'],
    ]);
});

test('user can not receive other user address', function () {
    $response = $this->getJson('/api/v2/customer/addresses/' . $this->addresses[1]->id);
    $response->assertStatus(403);
});

test('user can store address', function () {
    postJson(route('v2.addresses.store'), [
        'first_name' => $this->faker->firstNameMale(),
        'last_name' => $this->faker->lastName(),
        'address' => $this->faker->streetAddress(),
        'city' => $this->faker->city(),
        'state' => $this->faker->stateAbbr(),
        'zip' => $this->faker->postcode(),
        'phone' => $this->faker->phoneNumber(),
        'flat' => $this->faker->buildingNumber(),
    ])->assertCreated();
});
