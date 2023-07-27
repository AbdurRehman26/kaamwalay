<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $now = now();

        DB::table('payment_plans')->where(['id' => 1])->update(['price' => 14, 'max_protection_amount' => 100, 'updated_at' => $now]);
        DB::table('payment_plans')->where(['id' => 2])->update(['price' => 20, 'max_protection_amount' => 200, 'updated_at' => $now]);
        DB::table('payment_plans')->where(['id' => 3])->update(['price' => 30, 'max_protection_amount' => 500, 'updated_at' => $now]);
        DB::table('payment_plans')->where(['id' => 4])->update(['price' => 50, 'max_protection_amount' => 1000, 'updated_at' => $now]);
        DB::table('payment_plans')->where(['id' => 5])->update(['price' => 75, 'max_protection_amount' => 2000, 'updated_at' => $now]);
        DB::table('payment_plans')->where(['id' => 6])->update(['price' => 100, 'max_protection_amount' => 5000, 'updated_at' => $now]);
        DB::table('payment_plans')->where(['id' => 7])->update(['price' => 200, 'max_protection_amount' => 10000, 'updated_at' => $now]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $now = now();

        DB::table('payment_plans')->where(['id' => 1])->update(['price' => 18, 'max_protection_amount' => 200, 'updated_at' => $now]);
        DB::table('payment_plans')->where(['id' => 2])->update(['price' => 30, 'max_protection_amount' => 500, 'updated_at' => $now]);
        DB::table('payment_plans')->where(['id' => 3])->update(['price' => 50, 'max_protection_amount' => 1000, 'updated_at' => $now]);
        DB::table('payment_plans')->where(['id' => 4])->update(['price' => 75, 'max_protection_amount' => 2000, 'updated_at' => $now]);
        DB::table('payment_plans')->where(['id' => 5])->update(['price' => 100, 'max_protection_amount' => 5000, 'updated_at' => $now]);
        DB::table('payment_plans')->where(['id' => 6])->update(['price' => 200, 'max_protection_amount' => 10000, 'updated_at' => $now]);
        DB::table('payment_plans')->where(['id' => 7])->update(['price' => 500, 'max_protection_amount' => 100000, 'updated_at' => $now]);
    }
};
