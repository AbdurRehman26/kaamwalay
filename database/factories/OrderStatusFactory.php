<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\OrderState;
use App\Models\OrderStatus;

class OrderStatusFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'code' => $this->faker->firstName(),
            'name' => $this->faker->firstName(),
            'description' => $this->faker->text(),
            'order_state_id' => OrderState::factory(),
        ];
    }
}
