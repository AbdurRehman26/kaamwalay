<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
    {
        DB::table('payment_methods')->insert([
            [
                'code' => 'wallet',
                'name' => 'Customer Wallet',
                'is_visible' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        DB::table('payment_methods')
            ->where('code', 'wallet')
            ->delete();
    }
};
