<?php

use App\Models\CustomerAddress;
use Illuminate\Database\Eloquent\Factories\Sequence;

beforeEach(function () {
    $addresses = CustomerAddress::factory()
        ->count(2)
        ->state(new Sequence(
            ['id' => 1],
            ['id' => 2]
        ))
        ->create();
    $this->user = $addresses->first()->user;
    $this->actingAs($this->user);
});

test('user can receive addresses', function () {
    $response = $this->getJson('/api/v1/customer/addresses');
    $response->assertJsonStructure([
        'data' => [['id', 'first_name', 'last_name', 'state']],
    ]);
});

test('user can receive single address', function () {
    $response = $this->getJson('/api/v1/customer/addresses/1');
    $response->assertJsonStructure([
        'data' => ['id', 'first_name', 'last_name', 'state'],
    ]);
});

test('user can not receive other user address', function () {
    $response = $this->getJson('/api/v1/customer/addresses/2');
    $response->assertStatus(403);
});
