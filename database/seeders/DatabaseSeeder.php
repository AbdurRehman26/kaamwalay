<?php

namespace Database\Seeders;

use App\Models\CardProduct;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        CardProduct::disableSearchSyncing();

        $this->call([
            RolesSeeder::class,
            UsersSeeder::class,
            AddPlatformAdminUserSeeder::class,
            CardCategoriesSeeder::class,
            CardSeriesSeeder::class,
            CardSetsSeeder::class,
            CardProductSeeder::class,
            CountrySeeder::class,
            CustomerAddressSeeder::class,
            InvoiceSeeder::class,
            OrderSeeder::class,
            OrderItemSeeder::class,
            OrderItemShipmentSeeder::class,
            OrderItemCustomerShipmentSeeder::class,
            StateSeeder::class,
            CouponableSeeder::class,
        ]);

        CardProduct::enableSearchSyncing();
    }
}
