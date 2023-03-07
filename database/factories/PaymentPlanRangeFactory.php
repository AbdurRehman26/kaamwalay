<?php

namespace Database\Factories;

use App\Models\PaymentPlan;
use Illuminate\Database\Eloquent\Factories\Factory;

class PaymentPlanRangeFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        $min = $this->faker->numberBetween(1, 50);

        return [
            'payment_plan_id' => PaymentPlan::factory(),
            'min_cards' => $min,
            'max_cards' => $min + 10,
            'price' => $this->faker->numberBetween(20, 5000),
        ];
    }
}
