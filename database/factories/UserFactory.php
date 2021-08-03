<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\RoleUser;

class UserFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = User::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            'remember_token' => Str::random(10),
        ];
    }

    public function admin()
    {
        return $this->state([
            'name' => 'Carlos Morales',
            'email' => 'admin@robograding.com',
        ]);
    }
    /**
     * Adds questions to the questionnaire
     *
     * @param int $role
     * @return  $this
     */
    public function withRole(int $role)
    {
        return $this->afterCreating(function (User $user) use ($role) {
            RoleUser::factory()
                ->admin()
                ->create([
                    'user_id' => $user->id,
                    'role_id' => $role,
                ]);
        });
    }
}
