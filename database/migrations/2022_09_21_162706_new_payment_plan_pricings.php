<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
    {
        $now = now();

        DB::table('payment_plans')->where(['id' => 1])->update(['price' => 18, 'max_protection_amount' => 200, 'turnaround' => '20 Business Days', 'estimated_delivery_days_min' => 20, 'estimated_delivery_days_max' => 20, 'updated_at' => $now]);
        DB::table('payment_plans')->where(['id' => 2])->update(['price' => 30, 'max_protection_amount' => 500, 'turnaround' => '10 Business Days', 'estimated_delivery_days_min' => 10, 'estimated_delivery_days_max' => 10, 'updated_at' => $now]);
        DB::table('payment_plans')->where(['id' => 3])->update(['price' => 50, 'max_protection_amount' => 1000, 'turnaround' => '5 Business Days', 'estimated_delivery_days_min' => 5, 'estimated_delivery_days_max' => 5, 'updated_at' => $now]);
        DB::table('payment_plans')->where(['id' => 4])->update(['price' => 75, 'max_protection_amount' => 2000, 'turnaround' => '2-3 Business Days', 'estimated_delivery_days_min' => 2, 'estimated_delivery_days_max' => 3, 'updated_at' => $now]);
        DB::table('payment_plans')->where(['id' => 5])->update(['price' => 100, 'max_protection_amount' => 5000, 'turnaround' => '1 Business Day', 'estimated_delivery_days_min' => 1, 'estimated_delivery_days_max' => 1, 'updated_at' => $now]);
        DB::table('payment_plans')->where(['id' => 6])->update(['price' => 200, 'max_protection_amount' => 10000, 'turnaround' => 'Same Day', 'estimated_delivery_days_min' => 1, 'estimated_delivery_days_max' => 1, 'updated_at' => $now]);
        DB::table('payment_plans')->where(['id' => 7])->update(['price' => 500, 'max_protection_amount' => 100000, 'turnaround' => 'Same Day', 'estimated_delivery_days_min' => 1, 'estimated_delivery_days_max' => 1, 'updated_at' => $now, 'deleted_at' => null]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        //
    }
};
