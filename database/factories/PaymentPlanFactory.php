<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\PaymentPlan;

class PaymentPlanFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = PaymentPlan::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'price' => $this->faker->randomFloat(2, 10, 99999999.99),
            'max_protection_amount' => $this->faker->randomFloat(2, 10, 99999999.99),
            'turnaround' => $this->faker->word,
            'display_position' => $this->faker->numberBetween(1, 8),
        ];
    }
}
