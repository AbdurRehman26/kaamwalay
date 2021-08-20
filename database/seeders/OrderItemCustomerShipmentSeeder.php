<?php

namespace Database\Seeders;

use App\Models\OrderItemCustomerShipment;
use Illuminate\Database\Seeder;

class OrderItemCustomerShipmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        OrderItemCustomerShipment::factory()
            ->count(5)
            ->create();
    }
}
