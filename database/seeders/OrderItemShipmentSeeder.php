<?php

namespace Database\Seeders;

use App\Models\OrderItemShipment;
use Illuminate\Database\Seeder;

class OrderItemShipmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        OrderItemShipment::factory()
            ->count(5)
            ->create();
    }
}
