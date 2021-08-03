<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\User;
use Spatie\Permission\Models\Role;

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
     * @param string $role
     * @return  $this
     */
    public function withRole(string $role)
    {
        return $this->afterCreating(function (User $user) use ($role) {
            $role = Role::where('name', $role)->first();
            $user->assignRole($role);
        });
    }
}
