<?php

namespace Database\Factories;

use App\Enums\Wallet\WalletTransactionReason;
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
        $reason = $this->faker->randomElement([
            WalletTransactionReason::WALLET_CREDIT,
            WalletTransactionReason::ORDER_PAYMENT,
            WalletTransactionReason::REFUND,
        ]);
        $resource = $reason === WalletTransactionReason::WALLET_CREDIT ? WalletPayment::factory() : Order::factory();
        $resourceKey = $reason === WalletTransactionReason::WALLET_CREDIT ? 'wallet_payment_id' : 'order_id';

        return [
            'wallet_id' => Wallet::factory(),
            'created_by' => User::factory(),
            'amount' => random_int(100, 1500),
            'type' => $this->faker->randomElement([1, 2]),
            'reason' => $reason,
            $resourceKey => $resource,
            'is_success' => $this->faker->boolean(),
        ];
    }
}
