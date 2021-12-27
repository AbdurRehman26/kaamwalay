<?php

use App\Models\User;

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
                'value' => config('app.env'),
                'auth' => false,
            ],
            'APP_URL' => [
                'value' => config('app.env'),
                'auth' => true,
            ],
        ],
    ]);

    $response = $this->post('/api/configurations');
    $response->assertOk();
    $response->assertExactJson([
        'data' => [
            'app_env' => config('app.env'),
        ],
    ]);
});

it('should return correct configuration when using alias', function () {
    config([
        'configuration.keys' => [
            'APP_ENV' => [
                'key' => 'environment',
                'value' => config('app.env'),
                'auth' => false,
            ],
            'APP_URL' => [
                'value' => config('app.env'),
                'auth' => false,
            ],
        ],
    ]);

    $response = $this->post('/api/configurations');
    $response->assertOk();
    $response->assertJsonPath('data.APP_ENV', null);
    $response->assertExactJson([
        'data' => [
            'app_url' => config('app.env'),
            'environment' => config('app.env'),
        ],
    ]);
});

it('should correctly include auth keys for authenticated user', function () {
    config([
        'configuration.keys' => [
            'APP_ENV' => [
                'value' => config('app.env'),
                'auth' => false,
            ],
            'APP_URL' => [
                'value' => config('app.env'),
                'auth' => true,
            ],
        ],
    ]);

    $this->actingAs($this->user);

    $response = $this->post('/api/configurations');
    $response->assertOk();
    $response->assertExactJson([
        'data' => [
            'app_env' => config('app.env'),
            'app_url' => config('app.env'),
        ],
    ]);
});

it('should not include auth keys for guest user', function () {
    config([
        'configuration.keys' => [
            'APP_ENV' => [
                'value' => config('app.env'),
                'auth' => false,
            ],
            'APP_URL' => [
                'value' => config('app.env'),
                'auth' => true,
            ],
        ],
    ]);

    $response = $this->post('/api/configurations');
    $response->assertOk();
    $response->assertExactJson([
        'data' => [
            'app_env' => config('app.env'),
        ],
    ]);
});
