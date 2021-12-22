<?php

namespace Database\Factories;

use App\Models\Coupon;
use Illuminate\Database\Eloquent\Factories\Factory;

class CouponableFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'coupon_id' => Coupon::factory(),
            'couponables_id' => $this->faker->numberBetween(1, 10),
            'couponables_type' => $this->faker->word(),
        ];
    }
}
