<?php

namespace Database\Seeders;

use App\Models\VaultShipmentStatus;
use Illuminate\Database\Seeder;

class VaultShipmentStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        VaultShipmentStatus::factory()
        ->count(5)
        ->create();
    }
}
