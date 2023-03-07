<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Country;

class CountryFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'code' => $this->faker->countryCode(),
            'name' => $this->faker->country(),
            'phone_code' => $this->faker->randomNumber(2, true),
        ];
    }
}
