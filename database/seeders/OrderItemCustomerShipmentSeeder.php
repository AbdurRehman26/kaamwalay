<?php

namespace Database\Seeders;

use App\Models\OrderItemCustomerShipment;
use Illuminate\Database\Seeder;

class OrderItemCustomerShipmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        OrderItemCustomerShipment::factory()
            ->count(5)
            ->create();
    }
}
