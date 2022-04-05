<?php

namespace Database\Factories;

use App\Models\Coupon;
use App\Models\OrderAddress;
use App\Models\ShippingMethod;
use App\Models\User;
use App\Models\VaultShipmentStatus;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\VaultShipment>
 */
class VaultShipmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'shipment_number' => $this->faker->uuid(),
            'shipping_fee' => $this->faker->randomFloat(2, 50, 500),
            'grand_total' => $this->faker->randomFloat(2, 20, 10000),
            'user_id' => User::factory()->withRole(config('permission.roles.customer')),
            'coupon_id' => Coupon::factory()->create(),
            'vault_shipment_status_id' => VaultShipmentStatus::factory(),
            'shipping_address_id' => OrderAddress::factory(),
            'billing_address_id' => OrderAddress::factory(),
            'shipping_method_id' => ShippingMethod::factory(),
        ];
    }

    public function withShipping(): static
    {
        return $this->state([
            'shipped_at' => $this->faker->dateTime(),
            'tracking_number' => $this->faker->uuid(),
            'shipping_provider' => $this->faker->word(),
            'shipping_url' => $this->faker->url(),
        ]);
    }
}
