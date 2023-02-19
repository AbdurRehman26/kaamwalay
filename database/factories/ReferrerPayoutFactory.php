<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ReferrerPayoutFactory extends Factory
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
            'referral_code' => $this->faker->text(5),
            'withdrawable_commission' => $this->faker->randomFloat(2, 100, 1000),
            'link_clicks' => $this->faker->numberBetween(0, 100),
            'successful_signups' => $this->faker->numberBetween(0, 50),
            'referral_orders' => $this->faker->numberBetween(0, 20),
            'is_referral_active' => true,

            'date_initiated' => $this->faker->dateTime(),
            'completed_at' => $this->completed_at,
            'payout_account' => $this->payout_account,
            'status' => $this->payoutStatus->name,
            'amount' => $this->amount,

        ];
    }
}
