<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class CouponStatusFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $status = Arr::random(['queued', 'active', 'inactive', 'expired']);

        return [
            'code' => Arr::random(['queued', 'active', 'inactive', 'expired']),
            'name' => Str::title($status),
            'description' => $this->faker->sentence(),
        ];
    }
}
