<?php

namespace Database\Factories;

use App\Models\ReferrerPayout;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReferrerPayoutFactory extends Factory
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
            'paid_by' => User::factory(),
            'initiated_at' => $this->faker->dateTime(),
            'completed_at' => $this->faker->dateTime(),
            'payout_account' => $this->faker->email(),
            'payment_method' => ReferrerPayout::DEFAULT_PAYMENT_METHOD,
            'referrer_payout_status_id' => $this->faker->numberBetween(1, 4),
            'amount' => $this->faker->numberBetween(0, 1500),
        ];
    }
}
