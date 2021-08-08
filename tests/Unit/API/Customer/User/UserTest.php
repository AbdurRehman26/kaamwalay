<?php

namespace Tests\Unit\API\Customer\User;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Artisan;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    public function setUp(): void
    {
        parent::setUp();
        Artisan::call('db:seed', ['--class' => 'RolesSeeder']);
    }
    /**
     * A basic unit test example.
     * @test
     * @return void
     */
    public function customer_can_be_created_with_role()
    {
        $user = User::createCustomer([
            'first_name' => $this->faker->firstName,
            'last_name' => $this->faker->lastName,
            'email' => $this->faker->safeEmail,
            'username' => $this->faker->userName,
            'password' => bcrypt('password'),
        ]);
        $this->assertTrue($user->hasRole(config('permission.roles.customer'), 'api'));
    }
}
