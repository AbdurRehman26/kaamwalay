<?php

namespace Database\Factories;

use App\Models\Couponable;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class CouponFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'coupon_status_id' => \App\Models\CouponStatus::factory(),
            'coupon_applicable_id' => \App\Models\CouponApplicable::factory(),
            'code' => Str::random(10),
            'type' => Arr::random(['fixed', 'percentage']),
            'discount_value' => random_int(5, 25),
            'available_from' => now()->addDays(random_int(-5, 10)),
            'available_till' => now()->addDays(random_int(10, 15)),
        ];
    }
}
