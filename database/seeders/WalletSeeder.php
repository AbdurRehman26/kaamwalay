<?php

namespace Database\Seeders;

use App\Models\WalletTransaction;
use Illuminate\Database\Seeder;

class WalletSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        WalletTransaction::factory(10)->create();
    }
}
