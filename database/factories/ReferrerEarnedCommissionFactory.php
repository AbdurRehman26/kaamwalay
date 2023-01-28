<?php

namespace Database\Factories;

use App\Models\CommissionStructure;
use App\Models\Order;
use App\Models\Referrer;
use App\Models\UserCard;
use App\Models\VaultShipment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\VaultShipmentItem>
 */
class ReferrerEarnedCommissionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'referrer_id' => Referrer::factory(),
            'order_id' => Order::factory(),
            'commission_structure_id' => CommissionStructure::factory(),
            'type' => $this->faker->randomDigitNotZero(),
            'commission' => $this->faker->randomFloat(2, 1, 100),
        ];
    }
}
