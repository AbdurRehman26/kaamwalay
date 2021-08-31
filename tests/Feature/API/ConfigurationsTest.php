<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(TestCase::class);
uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
});

it('should not return any keys on empty configuration', function () {
    config(['configuration.keys' => []]);

    $response = $this->post('/api/configurations');
    $response->assertOk();
    $response->assertJsonPath('data', []);
    $response->assertJsonPath('data.app_env', null);
});

it('should return correct configuration', function () {
    config([
        'configuration.keys' => [
            'APP_ENV' => [
                'value' => env('APP_ENV'),
                'auth' => false,
            ],
            'APP_URL' => [
                'value' => env('APP_URL'),
                'auth' => true,
            ],
        ],
    ]);

    $response = $this->post('/api/configurations');
    $response->assertOk();
    $response->assertExactJson([
        'data' => [
            'app_env' => env('APP_ENV'),
        ],
    ]);
});

it('should return correct configuration when using alias', function () {
    config([
        'configuration.keys' => [
            'APP_ENV' => [
                'key' => 'environment',
                'value' => env('APP_ENV'),
                'auth' => false,
            ],
            'APP_URL' => [
                'value' => env('APP_URL'),
                'auth' => false,
            ],
        ],
    ]);

    $response = $this->post('/api/configurations');
    $response->assertOk();
    $response->assertJsonPath('data.APP_ENV', null);
    $response->assertExactJson([
        'data' => [
            'app_url' => env('APP_URL'),
            'environment' => env('APP_ENV'),
        ],
    ]);
});

it('should correctly include auth keys for authenticated user', function () {
    config([
        'configuration.keys' => [
            'APP_ENV' => [
                'value' => env('APP_ENV'),
                'auth' => false,
            ],
            'APP_URL' => [
                'value' => env('APP_URL'),
                'auth' => true,
            ],
        ],
    ]);

    $this->actingAs($this->user);

    $response = $this->post('/api/configurations');
    $response->assertOk();
    $response->assertExactJson([
        'data' => [
            'app_env' => env('APP_ENV'),
            'app_url' => env('APP_URL'),
        ],
    ]);
});

it('should not include auth keys for guest user', function () {
    config([
        'configuration.keys' => [
            'APP_ENV' => [
                'value' => env('APP_ENV'),
                'auth' => false,
            ],
            'APP_URL' => [
                'value' => env('APP_URL'),
                'auth' => true,
            ],
        ],
    ]);

    $response = $this->post('/api/configurations');
    $response->assertOk();
    $response->assertExactJson([
        'data' => [
            'app_env' => env('APP_ENV'),
        ],
    ]);
});
