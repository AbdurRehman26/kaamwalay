<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('shipping_methods')->where(['code' => 'insured_shipping'])->update(['name' => 'Shipping', 'updated_at' => now()]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('shipping_methods')->where(['code' => 'insured_shipping'])->update(['name' => 'Insured Shipping', 'updated_at' => now()]);
    }
};
