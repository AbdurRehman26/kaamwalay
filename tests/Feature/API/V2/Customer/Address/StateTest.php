<?php

use App\Models\State;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
});

test('a user can see states', function () {
    $this->actingAs($this->user);

    State::query()->delete();
    State::factory()
        ->count(5)
        ->create();
    $response = $this->getJson('/api/v2/customer/addresses/states');

    $response->assertJsonCount(5, 'data');
    $response->assertJsonStructure([
        'data' => [
            '*' => ['id', 'code', 'name'],
        ],
    ]);
});

test('a user can see specific state', function () {
    $this->actingAs($this->user);

    State::query()->delete();
    State::factory()->create();
    $response = $this->getJson('/api/v2/customer/addresses/states/' . State::first()->id);

    $response->assertJsonCount(3, 'data');
    $response->assertJsonStructure([
        'data' => ['id', 'code', 'name'],
    ]);
});

test('a guest cannot get states', function () {
    $response = $this->getJson('/api/v2/customer/addresses/states/');

    $response->assertUnauthorized();
});