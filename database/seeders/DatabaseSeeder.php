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
            UploadCardCategoriesImagesSeeder::class,
        ]);

        CardProduct::enableSearchSyncing();
    }
}
