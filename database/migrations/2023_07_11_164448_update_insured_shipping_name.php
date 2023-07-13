<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $now = now();

        DB::table('shipping_methods')->where(['code' => 'insured_shipping'])->update(['name' => 'Shipping', 'updated_at' => $now]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $now = now();

        DB::table('shipping_methods')->where(['code' => 'insured_shipping'])->update(['name' => 'Insured Shipping', 'updated_at' => $now]);
    }
};
