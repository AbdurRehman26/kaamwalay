<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SalesmanCommissionPayment>
 */
class SalesmanCommissionPaymentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'salesman_id' => User::factory()->withRole('salesman'),
            'added_by_id' => User::factory()->withRole('admin'),
            'amount' => $this->faker->randomFloat(10, 100),
            'notes' => $this->faker->boolean() ? $this->faker->sentence() : null,
            'file_url' => $this->faker->boolean() ? $this->faker->imageUrl() : null,
        ];
    }
}
