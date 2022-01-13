<?php

namespace Database\Factories;

use App\Models\PaymentMethod;
use App\Models\Wallet;
use Illuminate\Database\Eloquent\Factories\Factory;

class WalletPaymentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'payment_method_id' => PaymentMethod::factory(),
            'wallet_id' => Wallet::factory(),
            'amount' => $this->faker->randomFloat(10, 10, 100),
        ];
    }
}
