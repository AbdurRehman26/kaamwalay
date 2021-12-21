<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Arr;

class CouponStatusFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'code' => Arr::random(['queued', 'active', 'inactive', 'expired']),
            'name' => Arr::random(['Queued', 'Active', 'Inactive', 'Expired']),
            'description' => $this->faker->sentence(),
        ];
    }
}
