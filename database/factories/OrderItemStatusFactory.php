<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\OrderItemStatus;

class OrderItemStatusFactory extends Factory
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
        ];
    }
}
