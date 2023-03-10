<?php

namespace Database\Seeders;

use App\Models\WalletTransaction;
use Illuminate\Database\Seeder;

class WalletSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        WalletTransaction::factory(10)->create();
    }
}
