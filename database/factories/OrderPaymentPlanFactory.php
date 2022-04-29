<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class OrderPaymentPlanFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'price' => $this->faker->numberBetween(20, 5000),
            'max_protection_amount' => $this->faker->numberBetween(500, 10000),
            'turnaround' => $this->faker->numberBetween(1, 30) . ' Days',
        ];
    }
}
