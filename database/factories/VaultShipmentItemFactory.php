<?php

namespace Database\Factories;

use App\Models\UserCard;
use App\Models\VaultShipment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\VaultShipmentItem>
 */
class VaultShipmentItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'user_card_id' => UserCard::factory(),
            'vault_shipment_id' => VaultShipment::factory(),
        ];
    }
}
