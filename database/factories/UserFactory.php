<?php

namespace Database\Factories;

use App\Enums\Salesman\CommissionTypeEnum;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;

class UserFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'first_name' => $this->faker->firstName(),
            'last_name' => $this->faker->lastName(),
            'email' => $this->faker->unique()->safeEmail(),
            'username' => $this->faker->unique()->userName(),
            'email_verified_at' => now(),
            'password' => 'password', // password
            'remember_token' => Str::random(10),
            'ags_access_token' => Str::random(10),
            'customer_number' => Str::random(10),
            'last_login_at' => now(),
            'is_active' => true,
            'salesman_id' => null,
            'is_marketing_notifications_enabled' => true,
        ];
    }

    public function admin()
    {
        return $this->state([
            'first_name' => 'Carlos',
            'last_name' => 'Morales',
            'email' => 'admin@robograding.com',
        ]);
    }

    /**
     * Attach role to the newly created user.
     */
    public function withRole(string $role): static
    {
        return $this->afterCreating(function (User $user) use ($role) {
            $role = Role::where('name', $role)->first();
            $user->assignRole($role);
        });
    }

    /**
     * Attach role to the newly created user.
     *
     * @param  string  $role
     */
    public function withSalesmanRole(): static
    {
        return $this->afterCreating(function (User $user) {
            $user->assignRole(Role::where('name', config('permission.roles.salesman'))->first());
            $user->salesmanProfile()->create([
                'commission_type' => Arr::random([CommissionTypeEnum::PERCENTAGE, CommissionTypeEnum::FIXED]),
                'commission_value' => random_int(1, 50),
                'is_active' => true,
            ]);
        });
    }
}
