<?php

namespace Tests\Feature\API\Admin\Auth;

use App\Exceptions\API\Auth\AuthenticationException;
use App\Models\User;
use Database\Seeders\RolesSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class LoginTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolesSeeder::class);
    }

    /**
     * @test
     * @group auth
     */
    public function admin_can_login()
    {
        $user = User::factory()->withRole(config('permission.roles.admin'))->create();

        $response = $this->postJson('api/admin/auth/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $response->assertOk();
        $response->assertJsonStructure([
            'access_token',
            'type',
            'expiry',
        ]);
    }

    /**
     * @test
     * @group auth
     */
    public function customer_can_not_login_with_admin_route()
    {
        $user = User::factory()->withRole(config('permission.roles.customer'))->create();

        $response = $this->postJson('api/admin/auth/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $response->assertUnauthorized();
        $response->assertJsonStructure([ 'error' ]);
        $response->assertJsonPath('error', (new AuthenticationException)->getMessage());
    }

    /**
     * @test
     * @group auth
     */
    public function admin_can_not_login_with_invalid_password()
    {
        $user = User::factory()->withRole(config('permission.roles.admin'))->create();

        $response = $this->postJson('api/admin/auth/login', [
            'email' => $user->email,
            'password' => 'passWord12',
        ]);

        $response->assertUnauthorized();
        $response->assertJsonStructure([ 'error' ]);
        $response->assertJsonPath('error', (new AuthenticationException)->getMessage());
    }
}
