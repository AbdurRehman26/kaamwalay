<?php

namespace Database\Factories;

use App\Models\Coupon;
use App\Models\Couponable;
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
            'couponable_id' => $this->faker->numberBetween(1, 10),
            'couponable_type' => Couponable::COUPONABLE_TYPES['service_level'],
        ];
    }
}
