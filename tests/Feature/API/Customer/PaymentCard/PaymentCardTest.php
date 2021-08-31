<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(TestCase::class);
uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
});

test('user can receive payment cards', function () {
    $response = $this->get('api/customer/payment-cards');

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
    $response = $this->post('api/customer/payment-cards/setup');

    $response->assertOk();

    $response->assertJsonStructure([
        'intent' => [
            'client_secret',
            'customer',
            'object',
        ],
    ]);
})->group('payment');
