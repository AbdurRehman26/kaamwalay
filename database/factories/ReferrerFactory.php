<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReferrerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'referral_code' => $this->faker->text(5),
            'withdrawable_commission' => $this->faker->randomFloat(2, 100, 1000),
            'link_clicks' => $this->faker->numberBetween(0, 100),
            'successful_signups' => $this->faker->numberBetween(0, 50),
            'referral_orders' => $this->faker->numberBetween(0, 20),
            'is_referral_active' => true,
        ];
    }
}
