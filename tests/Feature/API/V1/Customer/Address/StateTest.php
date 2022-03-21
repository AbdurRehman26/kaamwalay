<?php

use App\Models\State;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
});

test('a user can see states', function () {
    $this->actingAs($this->user);

    State::factory()
        ->count(5)
        ->create();
    $response = $this->getJson('/api/v1/customer/addresses/states/');

    $response->assertJsonStructure([
        'data' => [
            '*' => ['id', 'code', 'name'],
        ],
    ]);
});

test('a user can see specific state', function () {
    $this->actingAs($this->user);

    State::factory()
        ->count(1)
        ->create(['id' => 1000]);
    $response = $this->getJson('/api/v1/customer/addresses/states/1000');

    $response->assertJsonCount(3, 'data');
    $response->assertJsonStructure([
        'data' => ['id', 'code', 'name'],
    ]);
});

test('a guest cannot get states', function () {
    $response = $this->getJson('/api/v1/customer/addresses/states/');

    $response->assertUnauthorized();
});