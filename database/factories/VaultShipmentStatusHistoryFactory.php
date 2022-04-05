<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\VaultShipment;
use App\Models\VaultShipmentStatus;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\VaultShipmentStatusHistory>
 */
class VaultShipmentStatusHistoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'vault_shipment_status_id' => VaultShipmentStatus::factory(),
            'vault_shipment_id' => VaultShipment::factory(),
            'user_id' => User::factory(),
        ];
    }
}
