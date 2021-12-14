<?php

namespace Database\Factories;

use App\Models\Coupon;
use App\Models\CouponStatus;
use Illuminate\Database\Eloquent\Factories\Factory;

class CouponStatusHistoryFactory extends Factory
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
            'coupon_status_id' => CouponStatus::factory(),
            'notes' => $this->faker->sentence(),
        ];
    }
}
