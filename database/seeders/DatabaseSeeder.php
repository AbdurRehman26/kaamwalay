<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CardProduct;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        CardProduct::disableSearchSyncing();

        $this->call([
            RolesSeeder::class,
            UsersSeeder::class,
            CardCategoriesSeeder::class,
            CardSeriesSeeder::class,
            CardSetsSeeder::class,
            CardProductSeeder::class,
            CountrySeeder::class,
            CustomerAddressSeeder::class,
            InvoiceSeeder::class,
            OrderAddressSeeder::class,
            OrderItemSeeder::class,
            OrderItemShipmentSeeder::class,
            OrderSeeder::class,
            OrderStateSeeder::class,
            OrderStatusSeeder::class,
            PaymentMethodSeeder::class,
            PaymentPlanSeeder::class,
            ShippingMethodSeeder::class,
            StateSeeder::class,
        ]);

        CardProduct::enableSearchSyncing();
    }
}
