<?php

namespace Database\Factories;

use App\Models\Country;
use Illuminate\Database\Eloquent\Factories\Factory;

class ShippingMetricFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'country_id' => Country::factory(),
            'box_default_value' => $this->faker->randomFloat(2, 1, 100),
            'slip_default_value' => $this->faker->randomFloat(2, 1, 100),
        ];
    }

}
