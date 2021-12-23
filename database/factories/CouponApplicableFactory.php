<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class CouponApplicableFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'code' => Arr::random(['service_fee', 'service_level', 'shipping_fee']),
            'label' => Str::title($this->faker->word()),
            'description' => $this->faker->sentence(),
            'is_active' => $this->faker->boolean(),
        ];
    }
}
