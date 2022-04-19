<?php

use App\Models\CustomerAddress;

use Illuminate\Foundation\Testing\WithFaker;

use function Pest\Laravel\actingAs;

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
