<?php

use App\Models\CustomerAddress;

beforeEach(function () {
    $addresses = CustomerAddress::factory()->count(2)->create();
    $this->user = $addresses->first()->user;
    $this->actingAs($this->user);
});

test('user can receive addresses', function () {
    $response = $this->getJson('/api/customer/addresses');
    $response->assertJsonStructure([
        'data' => [['id', 'first_name', 'last_name', 'state']],
    ]);
});

test('user can receive single address', function () {
    $response = $this->getJson('/api/customer/addresses/1');
    $response->assertJsonStructure([
        'data' => ['id', 'first_name', 'last_name', 'state'],
    ]);
});

test('user can not receive other user address', function () {
    $response = $this->getJson('/api/customer/addresses/2');
    $response->assertStatus(403);
});
