<?php

use App\Models\User;

use function Pest\Laravel\deleteJson;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
});

test('user can receive payment cards', function () {
    $response = $this->get('/api/v2/customer/payment-cards');

    $response->assertOk();

    $response->assertJsonStructure([
        'data' => [
            [
                'id',
                'customer',
                'card',
                'type',
            ],
        ],
    ]);
})->group('payment');

test('user can create card setup intent', function () {
    $response = $this->post('/api/v2/customer/payment-cards/setup');

    $response->assertOk();

    $response->assertJsonStructure([
        'intent' => [
            'client_secret',
            'customer',
            'object',
        ],
    ]);
})->group('payment');

test('user can delete a saved card', function () {
    deleteJson('/api/v2/customer/payment-cards/pm_123123123123')
        ->assertOk();
})->group('payment');
