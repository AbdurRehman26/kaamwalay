<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\User;
use App\Models\Wallet;
use App\Models\WalletPayment;
use App\Models\WalletTransaction;
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
            WalletTransaction::REASON_WALLET_CREDIT,
            WalletTransaction::REASON_ORDER_PAYMENT,
            WalletTransaction::REASON_REFUND,
        ]);
        $resource = $reason === WalletTransaction::REASON_WALLET_CREDIT ? WalletPayment::factory() : Order::factory();
        $resourceKey = $reason === WalletTransaction::REASON_WALLET_CREDIT ? 'wallet_payment_id' : 'order_id';
        return [
            'wallet_id' => Wallet::factory(),
            'created_by' => User::factory(),
            'type' => $this->faker->randomElement(['credit', 'debit']),
            'reason' => $reason,
            $resourceKey => $resource,
            'is_success' => $this->faker->boolean(),
        ];
    }
}
