<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('shipping_methods')->insert([
            [
                'code' => 'insured_shipping',
                'name' => 'Insured Shipping',
                'created_at' => new \Datetime(),
                'updated_at' => new \Datetime(),
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('shipping_methods')->truncate();
    }
};
