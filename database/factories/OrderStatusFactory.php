<?php

namespace Database\Factories;

use App\Models\OrderState;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderStatusFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'code' => $this->faker->firstName(),
            'name' => $this->faker->firstName(),
            'description' => $this->faker->text(),
            'order_state_id' => OrderState::factory(),
        ];
    }
}
