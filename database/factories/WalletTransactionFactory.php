<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\User;
use App\Models\Wallet;
use App\Models\WalletPayment;
use Illuminate\Database\Eloquent\Factories\Factory;

class WalletTransactionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $reason = $this->faker->randomElement(['order_payment', 'refund', 'wallet_credit']);
        $resource = $reason === 'wallet_credit' ? WalletPayment::factory() : Order::factory();
        $resourceKey = $reason === 'wallet_credit' ? 'wallet_payment_id' : 'order_id';
        return [
            'wallet_id' => Wallet::factory(),
            'initiated_by' => User::factory(),
            'amount' => random_int(100, 1500),
            'type' => $this->faker->randomElement(['credit', 'debit']),
            'reason' => $reason,
            $resourceKey => $resource,
            'is_success' => $this->faker->boolean(),
        ];
    }
}
