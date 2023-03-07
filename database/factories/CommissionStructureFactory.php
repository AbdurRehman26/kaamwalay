<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class CommissionStructureFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition(): array
    {
        return [
            'level' => rand(1, 5),
            'fixed_value_per_card' => $this->faker->randomDigitNotZero(),
            'percentage_value' => $this->faker->randomFloat(2, 1, 10),
        ];
    }
}
