<?php

namespace Database\Factories;

use App\Models\Coupon;
use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CouponLogFactory extends Factory
{
    public function definition(): array
    {
        return [
            'coupon_id' => Coupon::factory()->create(),
            'user_id' => User::factory()->create(),
            'order_id' => Order::factory()->create(),
        ];
    }
}
