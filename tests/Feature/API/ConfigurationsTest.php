<?php

namespace Tests\Feature\API;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ConfigurationsTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    /** @test */
    public function it_should_not_return_any_keys_on_empty_configuration(): void
    {
        config(['configuration.keys' => []]);

        $response = $this->post('/api/configurations');
        $response->assertOk();
        $response->assertJsonPath('data', []);
        $response->assertJsonPath('data.app_env', null);
    }

    /** @test */
    public function it_should_return_correct_configuration(): void
    {
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
    }

    /** @test */
    public function it_should_return_correct_configuration_when_using_alias(): void
    {
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
    }

    /** @test */
    public function it_should_correctly_include_auth_keys_for_authenticated_user(): void
    {
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
    }

    /** @test */
    public function it_should_not_include_auth_keys_for_guest_user(): void
    {
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
    }

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }
}
