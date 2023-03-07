<?php

namespace Database\Factories;

use App\Models\CardCategoryType;
use Illuminate\Database\Eloquent\Factories\Factory;

class CardCategoryTypeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->firstName(),
        ];
    }
}
