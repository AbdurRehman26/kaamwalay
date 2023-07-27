<?php

namespace Database\Factories;

use App\Models\CommissionStructure;
use App\Models\Order;
use App\Models\Referrer;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReferrerEarnedCommissionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
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
