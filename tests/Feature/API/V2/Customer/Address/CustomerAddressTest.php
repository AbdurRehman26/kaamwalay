<?php

use App\Models\CustomerAddress;

beforeEach(function () {
    $this->addresses = CustomerAddress::factory()->count(2)->create();
    $this->user = $this->addresses->first()->user;
    $this->actingAs($this->user);
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

test('a customer can add shipping address', function () {
    $this->actingAs($this->user);

    $response = $this->postJson('/api/v2/customer/addresses', [
        'shipping_address' => [
            'country_id' => '1',
            'first_name' => 'First',
            'last_name' => 'Last',
            'address' => 'Test address',
            'address2' => 'Test address 2',
            'city' => 'Test',
            'state' => 'AB',
            'zip' => '12345',
            'phone' => '1234567890',
        ]
    ]);
    $response->assertSuccessful();
    $response->assertJsonStructure([
        'data' => [
            'shipping_address',
        ],
    ]);
});

test('a customer can update shipping address', function () {
    $this->actingAs($this->user);

    $response = $this->postJson('/api/v2/customer/addresses', [
        'shipping_address' => [
            'country_id' => '1',
            'first_name' => 'First',
            'last_name' => 'Last',
            'address' => 'Test address',
            'address2' => 'Test address 2',
            'city' => 'Test',
            'state' => 'AB',
            'zip' => '12345',
            'phone' => '1234567890',
        ]
    ]);
    $response->assertSuccessful();
    $response->assertJsonStructure([
        'data' => [
            'shipping_address',
        ],
    ]);
});